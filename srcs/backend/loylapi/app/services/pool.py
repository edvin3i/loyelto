from decimal import Decimal
from sqlalchemy.orm import Session
from solders.keypair import Keypair
from app.services.exchange_client import ExchangeClient
from app.models.token import Token
from app.models.token_pool import TokenPool
from app.core.settings import settings



class PoolService:
    def __init__(self, db: Session, anchor: ExchangeClient):
        self.db, self.anchor = db, anchor

    async def bootstrap_pool(self, token: Token, percent: Decimal = Decimal("0.25")):
        # 1. calc volumes
        deposit_token = int(token.total_supply * percent)
        deposit_loyl  = int(Decimal(deposit_token) * token.rate_loyl)
        business_kp = Keypair.from_base58_string(token.business.owner_privkey)

        # 2. on-chain transaction (Anchor)
        tx_sig = await self.anchor.init_pool(
            loyalty_mint=token.mint,
            deposit_token=deposit_token,
            deposit_loyl=deposit_loyl,
            business_signer=business_kp,
        )


        # 3. save to db
        pool = TokenPool(
            token_id       = token.id,
            provider       = "platform",
            balance_token  = deposit_token,
            balance_loyl   = deposit_loyl,
            init_tx        = tx_sig,
        )
        self.db.add(pool)
        self.db.flush()  # ← id needs for Celery-task for confirmation

        return pool
