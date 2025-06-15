import asyncio                    # noqa: F401
from decimal import Decimal, ROUND_DOWN
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.exchange_client import ExchangeClient
from app.models.token import Token
from app.models.token_pool import TokenPool


class PoolService:
    def __init__(self, db: AsyncSession, anchor: ExchangeClient):
        """
        db: AsyncSession
        anchor: ExchangeClient
        """
        self.db, self.anchor = db, anchor

    async def bootstrap_pool(
        self,
        token: Token,
        business_id: str,
        percent: Decimal = Decimal("0.25"),
    ):
        """
        Creates initial liquidity for a brand-token pool.

        token      – Token ORM object (already persisted)
        business_id– UUID of the Business; used to derive PDA on-chain
        percent    – share of initial_supply sent to the pool (0.25 = 25 %)
        """
        # 1. volumes -------------------------------------------------------
        initial_supply = 1_000_000 * token.base_units

        deposit_token = int(initial_supply * percent)

        loyl_dec = (Decimal(deposit_token) * token.rate_loyl).quantize(
            Decimal("1"), rounding=ROUND_DOWN
        )
        deposit_loyl = int(loyl_dec)

        # 2. on-chain transaction (Anchor)
        # authority == business PDA, signer == treasury_kp
        tx_sig = await self.anchor.init_pool_with_pda(
            loyalty_mint=token.mint,
            deposit_token=deposit_token,
            deposit_loyl=deposit_loyl,
            business_id=business_id,
        )

        # 3. save to DB
        pool = TokenPool(
            token_id=token.id,
            provider="platform",
            balance_token=deposit_token,
            balance_loyl=deposit_loyl,
            init_tx=tx_sig,
        )
        self.db.add(pool)
        await self.db.flush()  # ← id required for Celery confirmation

        return pool
