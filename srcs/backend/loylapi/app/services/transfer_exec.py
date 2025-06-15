import asyncio, base58, base64
from base64 import b64encode
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.signature import Signature
from solders.instruction import Instruction, AccountMeta
from solders.message import Message
from solana.rpc.async_api import AsyncClient
from solana.rpc.types import TxOpts
from solana.rpc.commitment import Confirmed
from spl.token.constants import TOKEN_2022_PROGRAM_ID
from spl.token.instructions import get_associated_token_address

from app.services.privy_client import PrivyClient
from app.core.settings import settings


def build_transfer_ix(
    mint: Pubkey,
    src_owner: Pubkey,
    dst_owner: Pubkey,
    amount: int,
) -> Instruction:
    """
    Build a raw SPL-2022 transfer instruction.
    Instruction code = 3, amount in little-endian U64.
    """
    src_ata = get_associated_token_address(mint, src_owner)
    dst_ata = get_associated_token_address(mint, dst_owner)
    data = bytes([3]) + amount.to_bytes(8, "little")
    accounts = [
        AccountMeta(src_ata, is_signer=False, is_writable=True),
        AccountMeta(dst_ata, is_signer=False, is_writable=True),
        AccountMeta(src_owner, is_signer=True, is_writable=False),
    ]
    return Instruction(TOKEN_2022_PROGRAM_ID, accounts, data)


async def _submit_transfer(
    *,
    mint: str,
    sender: str,
    recipient: str,
    amount: int,
    sender_kp: Keypair | None,
    sign_with_privy: bool,
) -> str:
    """
    Create, sign (either locally or via Privy), send transaction and return tx signature.
    """
    async with AsyncClient(settings.SOLANA_RPC_URL) as rpc:
        # fetch latest blockhash
        bh = (await rpc.get_latest_blockhash()).value.blockhash

        # prepare instruction and message
        mint_pk = Pubkey.from_string(mint)
        sender_pk = Pubkey.from_string(sender)
        dest_pk = Pubkey.from_string(recipient)

        msg = Message(
            instructions=[build_transfer_ix(mint_pk, sender_pk, dest_pk, amount)],
            payer=sender_pk,
            recent_blockhash=bh,
        )

        # --- Privy signing path ---------------------------------------------
        if sign_with_privy:
            # request full signed transaction from Privy
            privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)
            tx_b64 = b64encode(bytes(msg)).decode()
            signed_b64 = await privy.sign_transaction(sender, tx_b64)
            raw_tx = base64.b64decode(signed_b64)
            # forward signed tx to RPC
            resp = await rpc.send_raw_transaction(
                raw_tx,
                opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
            )
            return str(resp.value)

        # --- Local Keypair signing path -------------------------------------
        if sender_kp:
            # sign message locally
            sig = sender_kp.sign_message(bytes(msg))
            tx = Transaction.populate(msg)
            tx.signatures = [sig]
            # send signed transaction
            resp = await rpc.send_raw_transaction(
                bytes(tx),
                opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
            )
            return str(resp.value)

        # --- Error if no signing method provided ----------------------------
        raise ValueError("No signing method provided for transfer")


# Blocking wrappers for Celery tasks


def earn_token(mint: str, user_pubkey: str, business_kp_b58: str, amount: int) -> str:
    """
    Business → User: local keypair signs and submits.
    """
    kp = Keypair.from_bytes(base58.b58decode(business_kp_b58))
    return asyncio.run(
        _submit_transfer(
            mint=mint,
            sender=str(kp.pubkey()),
            recipient=user_pubkey,
            amount=amount,
            sender_kp=kp,
            sign_with_privy=False,
        )
    )


def redeem_token(mint: str, user_pubkey: str, business_pubkey: str, amount: int) -> str:
    """
    User → Business: transaction signed via Privy.
    """
    return asyncio.run(
        _submit_transfer(
            mint=mint,
            sender=user_pubkey,
            recipient=business_pubkey,
            amount=amount,
            sender_kp=None,
            sign_with_privy=True,
        )
    )


def earn_token_pda(
    mint: str,
    user_pubkey: str,
    business_pda: str,
    treasury_kp_b58: str,
    amount: int,
) -> str:
    """Business PDA → User: signed by platform treasury."""
    kp = Keypair.from_bytes(base58.b58decode(treasury_kp_b58))
    return asyncio.run(
        _submit_transfer(
            mint=mint,
            sender=business_pda,
            recipient=user_pubkey,
            amount=amount,
            sender_kp=kp,
            sign_with_privy=False,
        )
    )


def redeem_token_pda(
    mint: str,
    user_pubkey: str,
    business_pda: str,
    amount: int,
) -> str:
    """User → Business PDA: signed by user via Privy."""
    return asyncio.run(
        _submit_transfer(
            mint=mint,
            sender=user_pubkey,
            recipient=business_pda,
            amount=amount,
            sender_kp=None,
            sign_with_privy=True,
        )
    )
