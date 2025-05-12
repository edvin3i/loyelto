from decimal import Decimal, ROUND_DOWN
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.business import Business
from app.models.promotion import PromotionCampaign
from app.models.transactions import TxType
from app.models.wallet import Wallet
from app.services.balance import balance_service
from app.services.business import business_service
from app.services.point_tx import point_tx_service
from app.tasks.transfer import transfer_earn_task, transfer_redeem_task
from app.schemas.point_tx import PointTxCreate


class LoyaltyService:
    """
    High-level domain service for earning / redeeming loyalty points.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    # ---------- earn ----------
    async def earn_points(
        self, *, business: Business, wallet: Wallet, purchase_amount: Decimal
    ):
        token = business.loyalty_token
        # points = price / rate_loyl → в base-units
        pts_dec = (purchase_amount / business.rate_loyl).quantize(
            Decimal("1"), rounding=ROUND_DOWN
        )
        points = int(pts_dec) * token.base_units
        # enqueue on-chain transfer
        transfer_earn_task.delay(
            business_kp_b58=business.owner_privkey,
            mint=token.mint,
            user_pubkey=wallet.pubkey,
            amount=points,
        )
        await balance_service.adjust_balance(self.db, wallet, token, points)
        return await point_tx_service.create(
            self.db,
            PointTxCreate(
                wallet_id=wallet.id,
                tx_type=TxType.EARN,
                amount=points,
                fee_bps=0,
                token_id=token.id,
                sol_sig=None,
            ),
        )

    # ---------- redeem ----------
    async def redeem_points(
        self,
        *,
        campaign: PromotionCampaign,
        wallet: Wallet,
        purchase_amount: Decimal,
    ) -> dict:
        token = campaign.business.loyalty_token
        # check balance
        bal = await balance_service.get_balance(self.db, wallet, token)
        if bal < campaign.price_points:
            raise ValueError("INSUFFICIENT_POINTS")

        # enqueue transfer user→business
        transfer_redeem_task.delay(
            user_pubkey=wallet.pubkey,
            mint=token.mint,
            business_pubkey=campaign.business.wallets[0].pubkey,
            amount=campaign.price_points,
        )
        await balance_service.adjust_balance(
            self.db, wallet, token, -campaign.price_points
        )
        discount = (purchase_amount * Decimal(campaign.discount_pct)) / Decimal(100)
        tx = await point_tx_service.create(
            self.db,
            PointTxCreate(
                wallet_id=wallet.id,
                tx_type=TxType.REDEEM,
                amount=campaign.price_points,
                fee_bps=0,
                token_id=token.id,
                sol_sig=None,
            ),
        )
        return {
            "point_tx": tx,
            "final_amount": purchase_amount - discount,
            "discount": discount,
        }
