from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, conint
from app.schemas.base import BaseDBSchema
from app.models.promotion import PromotionType


class PromotionCreate(BaseModel):
    business_id: UUID
    name: str
    promo_type: PromotionType = PromotionType.DISCOUNT
    price_points: conint(gt=0)
    discount_pct: conint(gt=0, le=100)
    active_from: datetime | None = None
    active_to: datetime | None = None


class PromotionUpdate(BaseModel):
    name: str | None = None
    price_points: conint(gt=0) | None = None
    discount_pct: conint(gt=0, le=100) | None = None
    active_from: datetime | None = None
    active_to: datetime | None = None


class PromotionOut(BaseDBSchema):
    business_id: UUID
    name: str
    promo_type: PromotionType = PromotionType.DISCOUNT
    price_points: conint(gt=0)
    discount_pct: conint(gt=0, le=100)
    active_from: datetime | None = None
    active_to: datetime | None = None
