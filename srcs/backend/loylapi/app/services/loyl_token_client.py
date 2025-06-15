from __future__ import annotations

import base64
from base64 import b64encode
from pathlib import Path

from anchorpy import Idl, Program, Provider, Wallet
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from spl.token.constants import TOKEN_2022_PROGRAM_ID
from spl.token.instructions import get_associated_token_address
from solders.message import Message
from solders.pubkey import Pubkey
from solders.transaction import Transaction

from app.core.settings import settings
from app.services.privy_client import PrivyClient


BASE_DIR = Path(__file__).resolve().parent
IDL_PATH = (BASE_DIR / settings.LOYL_IDL_PATH).resolve()

try:
    _IDL: Idl = Idl.from_json(IDL_PATH.read_text())
except Exception as e:  # pragma: no cover
    raise RuntimeError(f"Failed to load IDL at {IDL_PATH}: {e}")

LOYL_PROGRAM_ID = Pubkey.from_string(settings.LOYL_TOKEN_PROGRAM_ID)


class LoylTokenClient:
    """Thin wrapper around the `loyl_token` Anchor program."""

    def __init__(self) -> None:
        pass

    async def earn_points(self, mint: str, user_pubkey: str, amount: int) -> str:
        """Transfer loyalty points from treasury PDA to user."""
        mint_pk = Pubkey.from_string(mint)
        user_pk = Pubkey.from_string(user_pubkey)
        treasury_pda, _ = Pubkey.find_program_address(
            [b"treasury", bytes(mint_pk)],
            LOYL_PROGRAM_ID,
        )
        treasury_ata = get_associated_token_address(mint_pk, treasury_pda)
        user_ata = get_associated_token_address(mint_pk, user_pk)

        async with AsyncClient(settings.SOLANA_RPC_URL) as rpc:
            provider = Provider(rpc, Wallet(settings.treasury_kp))
            program = Program(_IDL, LOYL_PROGRAM_ID, provider)

            ix = program.instruction["earnPoints"](
                amount,
                ctx={
                    "accounts": {
                        "mint": mint_pk,
                        "treasury": treasury_pda,
                        "treasuryAta": treasury_ata,
                        "user": user_pk,
                        "userAta": user_ata,
                        "tokenProgram": TOKEN_2022_PROGRAM_ID,
                    }
                },
            )

            bh = (await rpc.get_latest_blockhash()).value.blockhash
            msg = Message(instructions=[ix], payer=settings.treasury_kp.pubkey(), recent_blockhash=bh)
            sig = settings.treasury_kp.sign_message(bytes(msg))
            tx = Transaction.populate(msg)
            tx.signatures = [sig]

            resp = await rpc.send_raw_transaction(
                bytes(tx),
                opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
            )
            return str(resp.value)

    async def redeem_points(self, mint: str, user_pubkey: str, amount: int) -> str:
        """Transfer loyalty points from user to treasury PDA using Privy signing."""
        mint_pk = Pubkey.from_string(mint)
        user_pk = Pubkey.from_string(user_pubkey)
        treasury_pda, _ = Pubkey.find_program_address(
            [b"treasury", bytes(mint_pk)],
            LOYL_PROGRAM_ID,
        )
        treasury_ata = get_associated_token_address(mint_pk, treasury_pda)
        user_ata = get_associated_token_address(mint_pk, user_pk)

        async with AsyncClient(settings.SOLANA_RPC_URL) as rpc:
            provider = Provider(rpc, Wallet(settings.treasury_kp))
            program = Program(_IDL, LOYL_PROGRAM_ID, provider)

            ix = program.instruction["redeemPoints"](
                amount,
                ctx={
                    "accounts": {
                        "mint": mint_pk,
                        "treasury": treasury_pda,
                        "treasuryAta": treasury_ata,
                        "user": user_pk,
                        "userAta": user_ata,
                        "tokenProgram": TOKEN_2022_PROGRAM_ID,
                    }
                },
            )

            bh = (await rpc.get_latest_blockhash()).value.blockhash
            msg = Message(instructions=[ix], payer=user_pk, recent_blockhash=bh)

            privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)
            tx_b64 = b64encode(bytes(msg)).decode()
            signed_b64 = await privy.sign_transaction(user_pubkey, tx_b64)
            raw_tx = base64.b64decode(signed_b64)

            resp = await rpc.send_raw_transaction(
                raw_tx,
                opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
            )
            return str(resp.value)
