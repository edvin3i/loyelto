from __future__ import annotations

import asyncio
import base58
from base64 import b64decode, b64encode

from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.signature import Signature
from solders.instruction import Instruction, AccountMeta
from solders.message import Message
from solders.transaction import Transaction
from solana.rpc.async_api import AsyncClient
from solana.rpc.types import TxOpts
from solana.rpc.commitment import Confirmed
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import get_associated_token_address

from app.services.privy_client import PrivyClient
from app.core.settings import settings


# Instruction builder                                                   #
def build_transfer_ix(
    mint: Pubkey, src_owner: Pubkey, dst_owner: Pubkey, amount: int
) -> Instruction:
    """Return a raw SPL-token Transfer (instruction = 3, amount little-endian)."""
    src_ata = get_associated_token_address(mint, src_owner)
    dst_ata = get_associated_token_address(mint, dst_owner)

    data = bytes([3]) + amount.to_bytes(8, "little")
    accounts = [
        AccountMeta(src_ata, is_signer=False, is_writable=True),
        AccountMeta(dst_ata, is_signer=False, is_writable=True),
        AccountMeta(src_owner, is_signer=True, is_writable=False),
    ]
    return Instruction(TOKEN_PROGRAM_ID, accounts, data)


# Core async helper                                                     #
async def _submit_transfer(
    *,
    mint: str,
    sender: str,
    recipient: str,
    amount: int,
    sender_kp: Keypair | None,
    sign_with_privy: bool,
) -> str:
    """Create, sign (Privy or KP), send transaction and return signature string."""
    async with AsyncClient(settings.SOLANA_RPC_URL) as rpc:
        bh = (await rpc.get_latest_blockhash()).value.blockhash

        mint_pk = Pubkey.from_string(mint)
        sender_pk = Pubkey.from_string(sender)
        recip_pk = Pubkey.from_string(recipient)

        msg = Message(
            instructions=[build_transfer_ix(mint_pk, sender_pk, recip_pk, amount)],
            payer=sender_pk,
            recent_blockhash=bh,
        )

        # --- produce Signature ------------------------------------------------
        if sender_kp and not sign_with_privy:
            sig = sender_kp.sign_message(bytes(msg))
        elif sign_with_privy:
            privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)
            sig_b64 = await privy.sign_transaction(
                sender, b64encode(bytes(msg)).decode()
            )
            sig = Signature.from_bytes(b64decode(sig_b64))
        else:
            raise ValueError("No signing method provided")

        # --- build Transaction -------------------------------------------------
        tx = Transaction.populate(msg)
        tx.signatures = [sig]  # order must match signer list

        # --- send --------------------------------------------------------------
        resp = await rpc.send_raw_transaction(
            bytes(tx),
            opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
        )
        return str(resp.value)


# Blocking wrappers (for Celery)                                        #
def earn_token(mint: str, user_pubkey: str, business_kp_b58: str, amount: int) -> str:
    """Business → User transfer (server Keypair signs)."""
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
    """User → Business transfer (user signs via Privy)."""
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
