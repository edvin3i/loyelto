# app/services/promotion_campaign.py
from app.crud.base import CRUDBase
from app.services.base import BaseService
from app.models.promotion import PromotionCampaign
from app.schemas.promotion import PromotionCreate, PromotionUpdate

crud_promo = CRUDBase[PromotionCampaign, PromotionCreate, PromotionUpdate](
    PromotionCampaign
)


class PromotionCampaignService(
    BaseService[PromotionCampaign, PromotionCreate, PromotionUpdate]
):
    pass


promotion_campaign_service = PromotionCampaignService(crud_promo)
