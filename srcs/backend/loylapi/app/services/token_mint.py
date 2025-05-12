import asyncio, base58, decimal
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from solana.rpc.async_api import AsyncClient
from spl.token.async_client import AsyncToken
from spl.token.constants import TOKEN_PROGRAM_ID
from solders.keypair import Keypair
from app.core.settings import settings
from app.models.business import Business
from app.models.token import Token
from app.services.pool import PoolService
from app.services.exchange_client import ExchangeClient

# Configure decimal precision
_DEC_CTX = decimal.getcontext()
_DEC_CTX.prec = 28  # enough for 18-digit fixed point

# Async engine & session factory
engine = create_async_engine(settings.database_url, future=True, echo=False)
SessionMaker: async_sessionmaker[AsyncSession] = async_sessionmaker(
    engine, expire_on_commit=False
)

# Solana RPC client
sol_client = AsyncClient(settings.SOLANA_RPC_URL)


async def _mint_and_record_async(business_id: str):
    # 1) Open async DB session
    async with SessionMaker() as db:  # type: AsyncSession
        biz: Business | None = await db.get(Business, business_id)
        if biz is None:
            raise ValueError("Business not found")

        # 2) Decode business owner keypair
        owner_kp = Keypair.from_bytes(base58.b58decode(biz.owner_privkey))
        decimals = 2  # loyalty points decimals

        # 3) Create SPL-2022 mint
        token_client = await AsyncToken.create_mint(
            sol_client,
            payer=owner_kp,
            mint_authority=owner_kp.pubkey(),
            decimals=decimals,
            program_id=TOKEN_PROGRAM_ID,
        )
        mint_addr = str(token_client.pubkey)

        # 4) Create associated token account for owner
        owner_ata = await token_client.create_associated_token_account(
            owner_kp.pubkey()
        )

        # 5) Mint initial supply to owner's ATA
        initial_supply = 1_000_000 * (10**decimals)
        await token_client.mint_to(
            owner_ata,
            owner_kp,
            initial_supply,
        )

        # 6) Persist new Token record with actual supply
        db_token = Token(
            mint=mint_addr,
            symbol=biz.slug.upper()[:6],
            business_id=biz.id,
            settlement_token=False,
            rate_loyl=biz.rate_loyl,
            decimals=decimals,
            min_rate=None,
            max_rate=None,
            total_supply=initial_supply,  # record actual minted amount
        )
        db.add(db_token)
        await db.commit()
        await db.refresh(db_token)

        # 7) Bootstrap liquidity pool (25% of supply)
        anchor = ExchangeClient(
            rpc_url=settings.SOLANA_RPC_URL,
            payer_keypair=settings.treasury_kp,
            program_id=settings.exchange_program_pk,
            idl_path=settings.root / "anchor/target/idl/exchange.json",
        )
        pool_service = PoolService(db, anchor)
        await pool_service.bootstrap_pool(db_token)

        # 8) Final commit of pool record
        await db.commit()


def mint_and_record(business_id: str):
    """Blocking wrapper for Celery."""
    asyncio.run(_mint_and_record_async(business_id))
