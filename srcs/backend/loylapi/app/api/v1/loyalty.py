import datetime
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models.promotion import PromotionCampaign
from app.services.balance import balance_service
from app.services.business import business_service
from app.services.wallet import wallet_service
from app.services.promotion_campaign import promotion_campaign_service
from app.services.loyalty import LoyaltyService
from app.schemas.base import BaseSchema
from app.schemas.point_tx import PointTxOut
from app.schemas.promotion import PromotionOut

router = APIRouter(prefix="/loyalty", tags=["loyalty"])


class EarnRequest(BaseSchema):
    wallet_pubkey: str
    purchase_amount: Decimal


class RedeemRequest(BaseSchema):
    wallet_pubkey: str
    campaign_id: UUID
    purchase_amount: Decimal


class RedeemResponse(BaseSchema):
    point_tx: PointTxOut
    final_amount: Decimal
    discount: Decimal


@router.post(
    "/business/{biz_id}/earn",
    response_model=PointTxOut,
    status_code=status.HTTP_201_CREATED,
)
async def earn_points(
    biz_id: UUID, payload: EarnRequest, db: AsyncSession = Depends(get_db)
):
    biz = await business_service.read(db, biz_id)
    if not biz:
        raise HTTPException(status_code=404, detail="business not found")
    wallet = await wallet_service.get_by_pubkey(db, payload.wallet_pubkey)
    if not wallet:
        raise HTTPException(status_code=404, detail="wallet not found")

    service = LoyaltyService(db)
    tx = await service.earn_points(
        business=biz, wallet=wallet, purchase_amount=payload.purchase_amount
    )
    await db.commit()
    return tx


@router.post(
    "/business/{biz_id}/redeem",
    response_model=RedeemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def redeem_points(
    biz_id: UUID, payload: RedeemRequest, db: AsyncSession = Depends(get_db)
):
    campaign = await promotion_campaign_service.read(db, payload.campaign_id)
    if not campaign or str(campaign.business_id) != str(biz_id):
        raise HTTPException(status_code=404, detail="campaign not found")
    wallet = await wallet_service.get_by_pubkey(db, payload.wallet_pubkey)
    if not wallet:
        raise HTTPException(status_code=404, detail="wallet not found")

    service = LoyaltyService(db)
    res = await service.redeem_points(
        campaign=campaign, wallet=wallet, purchase_amount=payload.purchase_amount
    )
    await db.commit()
    return res


@router.get("/business/{biz_id}/campaigns", response_model=list[PromotionOut])
async def list_campaigns(
    biz_id: UUID,
    wallet_pubkey: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Return active campaigns affordable by user balance.
    """
    wallet = await wallet_service.get_by_pubkey(db, wallet_pubkey)
    if not wallet:
        raise HTTPException(status_code=404, detail="wallet not found")
    biz = await business_service.read(db, biz_id)
    if not biz:
        raise HTTPException(status_code=404, detail="business not found")

    token = biz.loyalty_token
    bal = await balance_service.get_balance(db, wallet, token)
    all_campaigns = await promotion_campaign_service.read_many(
        db,
        filters=[
            PromotionCampaign.business_id == biz_id,
            PromotionCampaign.active_from <= datetime.datetime.now(datetime.UTC),
            PromotionCampaign.active_to >= datetime.datetime.now(datetime.UTC),
        ],
        limit=100,
    )
    return [c for c in all_campaigns if bal >= c.price_points]
