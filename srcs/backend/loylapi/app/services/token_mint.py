from __future__ import annotations
import asyncio, base58
from pathlib import Path
from solders.pubkey import Pubkey
from solders.keypair import Keypair
from solana.rpc.async_api import AsyncClient
from anchorpy import Provider, Wallet, Idl, Program
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.settings import settings
from app.db.session import AsyncSessionLocal
from app.models import Business, Token
from app.services.exchange_client import ExchangeClient
from app.services.pool import PoolService

# --- Constants & cached IDL load ----------------------------------------
# The path to the IDL for loyalty_token
BASE_DIR = Path(__file__).resolve().parent
# print(f"==================== {BASE_DIR} ====================")
IDL_PATH = (BASE_DIR / settings.LOYL_IDL_PATH).resolve()

_IDL: Idl
try:
    _IDL = Idl.from_json(IDL_PATH.read_text())
except Exception as e:
    raise RuntimeError(f"Failed to load IDL at {IDL_PATH}: {e}")

LOYALTY_PROGRAM_ID = Pubkey.from_string(settings.LOYL_TOKEN_PROGRAM_ID)


# --- Core mint & record logic ------------------------------------------


async def _mint_and_record_async(business_id: str) -> None:
    """
    Creates a branded loyalty token for a business and initializes a liquidity pool:
    1) Retrieve the business and its owner's keypair
    2) Create the branded loyalty token via the Anchor RPC createLoyaltyMint
    3) Derive the PDA (Program Derived Address) for the mint
    4) Save the token record to the database
    5) Bootstrap the liquidity pool via ExchangeClient + PoolService
    """
    # 1) We open a session
    async with AsyncSessionLocal() as db:  # type: AsyncSession
        biz: Business | None = await db.get(Business, business_id)
        if biz is None:
            raise ValueError(f"Business {business_id} not found")

        # Decoding the owner's key
        owner_kp = Keypair.from_bytes(base58.b58decode(biz.owner_privkey))

        # 2) Creating a Solana RPC client
        async with AsyncClient(settings.SOLANA_RPC_URL) as rpc_client:
            # Setting up AnchorPy Provider + Program
            provider = Provider(rpc_client, Wallet(owner_kp))
            program = Program(_IDL, LOYALTY_PROGRAM_ID, provider)

            decimals = 2
            initial_supply = 1_000_000 * 10**decimals

            # Calling the on-chain method
            tx_sig = await program.rpc["createLoyaltyMint"](
                decimals,
                int(biz.rate_loyl * 10**6),  # fix-point 6 digits
                initial_supply,
                ctx={
                    "accounts": {
                        "authority": owner_kp.pubkey(),
                        "systemProgram": program.program.account["System"].program_id,
                    },
                    "signers": [owner_kp],
                },
            )

            # 3) PDA mint derivation
            mint_pda, _ = Pubkey.find_program_address(
                [b"mint", bytes(owner_kp.pubkey())],
                LOYALTY_PROGRAM_ID,
            )

        # 4) Saving the Token in the DB
        db_token = Token(
            mint=str(mint_pda),
            symbol=biz.slug.upper()[:6],
            business_id=biz.id,
            settlement_token=False,
            rate_loyl=biz.rate_loyl,
            decimals=decimals,
            min_rate=None,
            max_rate=None,
            total_supply=initial_supply,
        )
        db.add(db_token)
        await db.commit()
        await db.refresh(db_token)

        # 5) We initialize the liquidity pool.
        anchor_client = ExchangeClient(
            rpc_url=settings.SOLANA_RPC_URL,
            payer_keypair=settings.treasury_kp,
            program_id=settings.exchange_program_pk,
            idl_path=settings.root / "anchor/target/idl/exchange.json",
        )
        pool_service = PoolService(db, anchor_client)
        await pool_service.bootstrap_pool(db_token)
        await db.commit()


def mint_and_record(business_id: str) -> None:
    """
    Synchronous wrapper for Celery: runs the async token minting process.

    Args:
        business_id: UUID of the business to mint tokens for

    Raises:
        RuntimeError: If any step in the token minting process fails
    """
    try:
        asyncio.run(_mint_and_record_async(business_id))
    except Exception as err:
        # Log the error with more details
        import logging

        logging.error(
            f"Token minting failed for business {business_id}: {err}", exc_info=True
        )
        raise RuntimeError(f"mint_and_record failed for {business_id}: {err}") from err
