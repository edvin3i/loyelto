import asyncio
from base64 import b64encode, b64decode
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction
from solders.signature import Signature
from solana.rpc.types import TxOpts
from solana.rpc.commitment import Confirmed
from spl.token.instructions import get_associated_token_address
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.settings import settings
from app.services.privy_client import PrivyClient
from app.models.transactions import SwapTx
from app.models.token import Token
from app.models.wallet import Wallet
from app.db.session import AsyncSessionLocal
from app.services.exchange_client import ExchangeClient
from spl.token.constants import TOKEN_PROGRAM_ID


async def _perform_swap(swap_tx_id: str):
    # 1) load swap_tx, from_token, wallet and to_token in one session
    async with AsyncSessionLocal() as session:  # type: AsyncSession
        result = await session.execute(
            select(SwapTx, Token, Wallet)
            .join(Token, Token.id == SwapTx.from_token_id)
            .join(Wallet, Wallet.user_id == SwapTx.user_id)
            .where(SwapTx.id == swap_tx_id)
        )
        swap_tx, from_token, wallet = result.first()
        to_token = await session.get(Token, swap_tx.to_token_id)

    user_pubkey = PublicKey(wallet.pubkey)
    from_mint = PublicKey(from_token.mint)
    to_mint = PublicKey(to_token.mint)

    # 2) initialize Anchor client once
    anchor = ExchangeClient(
        rpc_url=settings.SOLANA_RPC_URL,
        payer_keypair=settings.treasury_kp,
        program_id=settings.exchange_program_pk,
        idl_path=settings.root / "anchor/target/idl/exchange.json",
    )
    program = anchor.program
    client = program.provider.connection

    # 3) derive pool PDA
    pool_pda, _ = PublicKey.find_program_address(
        [b"pool", bytes(from_mint)], program.program_id
    )

    # 4) build transaction
    tx = Transaction()
    tx.add(
        program.instruction.swap(
            swap_tx.from_amount,
            swap_tx.to_amount,
            ctx={
                "accounts": {
                    "pool": pool_pda,
                    "userSource": get_associated_token_address(from_mint, user_pubkey),
                    "userDest": get_associated_token_address(to_mint, user_pubkey),
                    "userAuthority": user_pubkey,
                    "tokenProgram": TOKEN_PROGRAM_ID,
                }
            },
        )
    )
    tx.fee_payer = user_pubkey

    # set recent blockhash
    latest = await client.get_latest_blockhash()
    tx.recent_blockhash = latest.value.blockhash

    # 5) sign via Privy and embed signature
    raw_msg = bytes(tx.message)
    msg_b64 = b64encode(raw_msg).decode("utf-8")
    privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)
    sig_bytes = b64decode(await privy.sign_transaction(wallet.pubkey, msg_b64))
    sig = Signature.from_bytes(sig_bytes)

    # replace placeholder signature for userAuthority
    sigs = list(tx.signatures)  # signatures → tuple
    if len(sigs) < len(tx.message.account_keys):
        # pad with default sigs if anchor didn't pre-fill (edge-case)
        sigs += [Signature.default()] * (len(tx.message.account_keys) - len(sigs))
    idx = tx.message.account_keys.index(user_pubkey)
    sigs[idx] = sig
    tx = tx.replace_signatures(sigs)

    # 6) send signed transaction
    resp = await client.send_raw_transaction(
        bytes(tx),
        opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
    )
    tx_sig = resp.value

    # 7) store sol_sig to DB
    async with AsyncSessionLocal() as session:
        rec = await session.get(SwapTx, swap_tx_id)
        rec.sol_sig = tx_sig
        await session.commit()

    # optional: free RPC resources
    await client.close()


def perform_swap(swap_tx_id: str):
    """Sync wrapper for Celery task."""
    asyncio.run(_perform_swap(swap_tx_id))
