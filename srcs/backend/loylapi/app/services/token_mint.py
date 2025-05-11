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

engine = create_async_engine(settings.database_url, future=True, echo=False)
SessionMaker: async_sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
sol_client = AsyncClient(settings.SOLANA_RPC_URL)

_DEC_CTX = decimal.getcontext()
_DEC_CTX.prec = 28  # enough for 18-digit fixed point


async def _mint_and_record_async(business_id: str):
    async with SessionMaker() as db:  # type: AsyncSession
        biz: Business = await db.get(Business, business_id)
        if not biz:
            raise ValueError("Business not found")

        owner_kp = Keypair.from_bytes(base58.b58decode(biz.owner_privkey))
        decimals = 2  # loyalty points default

        # 1. Create SPL-2022 mint (devnet/testnet)
        token = await AsyncToken.create_mint(
            sol_client,
            payer=owner_kp,
            mint_authority=owner_kp.public_key,
            decimals=decimals,
            program_id=TOKEN_PROGRAM_ID,
            skip_confirmation=False,
        )
        mint_addr = str(token.pubkey)

        # 2. Persist to DB
        db_token = Token(
            mint=mint_addr,
            symbol=biz.slug.upper()[:6],
            business_id=biz.id,
            settlement_token=False,
            rate_loyl=biz.rate_loyl,
            decimals=decimals,
            min_rate=None,
            max_rate=None,
            total_supply=0,
        )
        db.add(db_token)
        await db.commit()
        await db.refresh(db_token)

        # 3. Bootstrap pool (25 % liquidity)
        anchor = ExchangeClient(
            rpc_url=settings.SOLANA_RPC_URL,
            payer_keypair=settings.treasury_kp,
            program_id=settings.exchange_program_pk,
            idl_path=settings.root / "anchor/target/idl/exchange.json",
        )
        pool_service = PoolService(db, anchor)
        await pool_service.bootstrap_pool(db_token)

        await db.commit()


def mint_and_record(business_id: str):
    """Blocking wrapper for Celery."""
    asyncio.run(_mint_and_record_async(business_id))
