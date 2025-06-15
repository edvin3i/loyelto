from __future__ import annotations
import asyncio
import uuid
from pathlib import Path
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from anchorpy import Provider, Wallet, Idl, Program
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.settings import settings
from app.db.session import AsyncSessionLocal
from app.models import Business, Token
from app.services.exchange_client import ExchangeClient
from app.services.pool import PoolService

BASE_DIR = Path(__file__).resolve().parent
IDL_PATH = (BASE_DIR / settings.LOYL_IDL_PATH).resolve()

try:
    _IDL: Idl = Idl.from_json(IDL_PATH.read_text())
except Exception as e:                                            # pragma: no cover
    raise RuntimeError(f"Failed to load IDL at {IDL_PATH}: {e}")

LOYALTY_PROGRAM_ID = Pubkey.from_string(settings.LOYL_TOKEN_PROGRAM_ID)


async def _mint_and_record_async(business_id: str) -> None:
    """
    1. Get business id from DB
    2. Calculating PDA → authority for mint.
    3. Calling on-chain instruction `createLoyaltyMintWithPda`.
    4. Save Token and bootstraping the pool.
    """
    async with AsyncSessionLocal() as db:                     # type: AsyncSession
        biz: Business | None = await db.get(Business, business_id)
        if biz is None:
            raise ValueError(f"Business {business_id} not found")

        # PDA derivation
        business_id_bytes = uuid.UUID(business_id).bytes
        business_pda, _bump = Pubkey.find_program_address(
            [b"business", business_id_bytes],
            LOYALTY_PROGRAM_ID,
        )

        # Anchor provider
        async with AsyncClient(settings.SOLANA_RPC_URL) as rpc:
            provider = Provider(rpc, Wallet(settings.treasury_kp))
            program = Program(_IDL, LOYALTY_PROGRAM_ID, provider)

            decimals = 2
            initial_supply = 1_000_000 * 10**decimals  # 1 000 000 единиц

            # on-chain call
            await program.rpc["createLoyaltyMintWithPda"](
                business_id_bytes,
                decimals,
                int(biz.rate_loyl * 10**6),               # μLOYL
                initial_supply,
                ctx={
                    "accounts": {
                        "businessPda": business_pda,
                        "payer": settings.treasury_kp.pubkey(),
                        "systemProgram": Program.SYSTEM_PROGRAM_ID,
                    },
                    "signers": [settings.treasury_kp],
                },
            )

            # mint PDA (derived from business PDA)
            mint_pda, _ = Pubkey.find_program_address(
                [b"mint", bytes(business_pda)],
                LOYALTY_PROGRAM_ID,
            )

        # DB persist
        db_token = Token(
            mint=str(mint_pda),
            symbol=biz.slug.upper()[:6],
            business_id=biz.id,
            settlement_token=False,
            rate_loyl=biz.rate_loyl,
            decimals=decimals,
            total_supply=initial_supply,
        )
        db.add(db_token)
        await db.commit()
        await db.refresh(db_token)

        # pool bootstrap
        anchor_client = ExchangeClient(
            rpc_url=settings.SOLANA_RPC_URL,
            payer_keypair=settings.treasury_kp,
            program_id=settings.exchange_program_pk,
            idl_path=settings.root / "anchor/target/idl/exchange.json",
        )
        pool_service = PoolService(db, anchor_client)
        await pool_service.bootstrap_pool(db_token, business_id)
        await db.commit()


def mint_and_record(business_id: str) -> None:
    """
    Sync wrapper for Celery/CLI.
    """
    try:
        asyncio.run(_mint_and_record_async(business_id))
    except Exception as err:                                    # pragma: no cover
        import logging

        logging.error(
            "Token minting failed for business %s: %s", business_id, err, exc_info=True
        )
        raise RuntimeError(f"mint_and_record failed for {business_id}: {err}") from err
