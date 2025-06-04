import logging
import base58
from decimal import Decimal, ROUND_DOWN
from typing import Dict
from solders.keypair import Keypair
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Business, Wallet, PromotionCampaign, TxType
from app.services.balance import balance_service
from app.services.point_tx import point_tx_service
from app.schemas.point_tx import PointTxCreate
from app.tasks.transfer import transfer_earn_task, transfer_redeem_task

logger = logging.getLogger(__name__)


class InsufficientPointsError(Exception):
    """Raised when wallet has insufficient loyalty points for redemption."""


class LoyaltyService:
    """
    High-level domain service for earning / redeeming loyalty points.
    """

    def __init__(self, db: AsyncSession):
        """
        :param db: SQLAlchemy AsyncSession, transaction is managed by caller.
        """
        self.db = db

    async def earn_points(
        self,
        *,
        business: Business,
        wallet: Wallet,
        purchase_amount: Decimal,
    ) -> PointTxCreate:
        """
        Earn loyalty points for a purchase.

        1) Compute 'points' = floor(purchase_amount / rate_loyl) * base_units.
        2) Enqueue on-chain transfer (business → user).
        3) Update off-chain balance.
        4) Record PointTx in DB.

        :raises ValueError: if business.loyalty_token missing or invalid amounts.
        :return: PointTxCreate instance (with DB fields populated).
        """
        # 1) Validate
        token = business.loyalty_token
        if token is None:
            raise ValueError("Business has no loyalty token configured")

        if purchase_amount <= 0:
            raise ValueError("purchase_amount must be positive")

        # 2) Compute points in base_url units
        raw_units = (purchase_amount / business.rate_loyl).quantize(
            Decimal("1"), rounding=ROUND_DOWN
        )
        points = int(raw_units) * token.base_units
        if points <= 0:
            raise ValueError("purchase_amount too small to earn any points")

        # 3) Enqueue on-chain transfer
        transfer_earn_task.delay(
            business_kp_b58=business.owner_privkey,
            mint=token.mint,
            user_pubkey=wallet.pubkey,
            amount=points,
        )
        logger.info("Enqueued earn_points: biz=%s user=%s pts=%d",
                    business.id, wallet.user_id, points)

        # 4) Update off-chain balance
        bal = await balance_service.adjust_balance(self.db, wallet, token, points)
        # flush so that balance exists in same transaction
        await self.db.flush()

        # 5) Persist PointTx record
        pt_schema = PointTxCreate(
            wallet_id=wallet.id,
            tx_type=TxType.EARN,
            token_id=token.id,
            amount=points,
            fee_bps=0,
            sol_sig=None,
        )
        pt = await point_tx_service.create(self.db, pt_schema)
        logger.debug("Created PointTx EARN id=%s", pt.id)

        return pt

    async def redeem_points(
        self,
        *,
        campaign: PromotionCampaign,
        wallet: Wallet,
        purchase_amount: Decimal,
    ) -> Dict[str, any]:
        """
        Redeem loyalty points against a promotion campaign.

        1) Check wallet balance >= campaign.price_points.
        2) Enqueue on-chain transfer (user → business).
        3) Update off-chain balance.
        4) Record PointTx(REDEEM).
        5) Compute discount & final amount.

        :raises InsufficientPointsError: if balance < price_points.
        :raises ValueError: if campaign invalid or purchase_amount <= 0.
        :return: dict with keys: point_tx, discount, final_amount.
        """
        # 1) Validate campaign & amounts
        biz = campaign.business
        token = biz.loyalty_token
        if token is None:
            raise ValueError("Business has no loyalty token configured")
        if purchase_amount <= 0:
            raise ValueError("purchase_amount must be positive")

        # 2) Check off-chain balance
        balance = await balance_service.get_balance(self.db, wallet, token)
        if balance < campaign.price_points:
            raise InsufficientPointsError(
                f"Balance {balance} < required {campaign.price_points}"
            )

        # 3) Prepare business pubkey for on-chain transfer
        biz_kp = Keypair.from_bytes(base58.b58decode(biz.owner_privkey))
        biz_pubkey = str(biz_kp.pubkey())

        # 4) Enqueue on-chain transfer
        transfer_redeem_task.delay(
            user_pubkey=wallet.pubkey,
            mint=token.mint,
            business_pubkey=biz_pubkey,
            amount=campaign.price_points,
        )
        logger.info("Enqueued redeem_points: biz=%s user=%s pts=%d",
                    biz.id, wallet.user_id, campaign.price_points)

        # 5) Update off-chain balance
        await balance_service.adjust_balance(self.db, wallet, token, -campaign.price_points)
        await self.db.flush()

        # 6) Persist PointTx(REDEEM)
        pt_schema = PointTxCreate(
            wallet_id=wallet.id,
            tx_type=TxType.REDEEM,
            token_id=token.id,
            amount=campaign.price_points,
            fee_bps=0,
            sol_sig=None,
        )
        pt = await point_tx_service.create(self.db, pt_schema)
        logger.debug("Created PointTx REDEEM id=%s", pt.id)

        # 7) Compute discount & final amount
        discount = (purchase_amount * Decimal(campaign.discount_pct)) / Decimal(100)
        final_amount = (purchase_amount - discount).quantize(Decimal("0.01"))

        return {
            "point_tx": pt,
            "discount": discount,
            "final_amount": final_amount,
        }
