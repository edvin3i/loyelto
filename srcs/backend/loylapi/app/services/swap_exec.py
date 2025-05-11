import asyncio
from base64 import b64encode, b64decode
from solders.pubkey import Pubkey as PublicKey
from solders.transaction import Transaction
from solana.rpc.types import TxOpts
from solana.rpc.commitment import Confirmed
from solana.rpc.async_api import AsyncClient
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
    # 1) load SwapTx + related data from db
    async with AsyncSessionLocal() as session:  # type: AsyncSession
        result = await session.execute(
            select(SwapTx, Token, Wallet)
            .join(Token, Token.id == SwapTx.from_token_id)
            .join(Wallet, Wallet.user_id == SwapTx.user_id)
            .where(SwapTx.id == swap_tx_id)
        )
        swap_tx, token, wallet = result.first()

    user_pubkey = PublicKey(wallet.pubkey)
    from_mint = PublicKey(token.mint)
    # здесь нужно получить `to_mint` аналогично; для упрощения допустим swap на LOYL
    result2 = await AsyncSessionLocal().execute(
        select(Token).where(Token.id == swap_tx.to_token_id)
    )
    to_token = result2.scalar_one()
    to_mint = PublicKey(to_token.mint)

    # 2) calculating PDA for pool
    client = AsyncClient(settings.SOLANA_RPC_URL)
    program = ExchangeClient(
        rpc_url=settings.SOLANA_RPC_URL,
        payer_keypair=settings.treasury_kp,
        program_id=settings.exchange_program_pk,
        idl_path=ExchangeClient.__init__.__defaults__[3]  # idl_path
    ).program

    pool_pda, _ = PublicKey.find_program_address(
        seeds=[b"pool", bytes(from_mint)],
        program_id=program.program_id,
    )

    # 3) building transaction
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
    # getting recent blockhash
    rb = await client.get_recent_blockhash(Confirmed)
    tx.recent_blockhash = rb.value.blockhash

    # 4) lets code msg wo signs
    raw_msg = tx.serialize_message()
    b64_msg = b64encode(raw_msg).decode("utf-8")

    # 5) asking sign from Privy
    privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)
    signed_b64 = await privy.sign_transaction(wallet.pubkey, b64_msg)

    # 6) decode signed tx and send to Devnet
    signed_bytes = b64decode(signed_b64)
    opts = TxOpts(
        skip_preflight=False,  # do not skip preflight checks
        preflight_commitment=Confirmed # require at least 'confirmed' commitment
    )
    send_resp = await client.send_raw_transaction(signed_bytes, opts=opts)
    tx_sig = send_resp.value  # transaction signature

    # 7) store sol_sig to DB
    async with AsyncSessionLocal() as session:
        rec = await session.get(SwapTx, swap_tx_id)
        rec.sol_sig = tx_sig
        await session.commit()

    await client.close()


def perform_swap(swap_tx_id: str):
    """Sync wrapper for Celery task."""
    asyncio.run(_perform_swap(swap_tx_id))
