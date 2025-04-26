import datetime
from uuid import UUID
from pydantic import AnyUrl
from app.schemas.base import BaseSchema, BaseDBSchema
from app.schemas.types import (
    NameStr,
    TextAreaStr,
    Decimals,
    GeZero,
    MintStr,
    MediumStr,
    VouchStatEnum,
)


class VoucherTemplateCreate(BaseSchema):
    business_id: UUID
    name: NameStr
    description: TextAreaStr | None
    image_url: AnyUrl | None
    price_points: Decimals
    supply: GeZero
    expires_at: datetime | None
    collection_mint: MintStr | None


class VoucherTemplateUpdate(BaseSchema):
    expires_at: datetime | None = None


class VoucherTemplateOut(BaseDBSchema):
    business_id: UUID
    name: NameStr
    description: TextAreaStr | None
    image_url: AnyUrl | None
    price_points: Decimals
    supply: GeZero
    expires_at: datetime | None
    collection_mint: MintStr | None


class VoucherNFTCreate(BaseSchema):
    template_id: UUID
    user_id: UUID | None
    asset_id: MediumStr
    status: VouchStatEnum
    redeemed_at: datetime | None


class VoucherNFTUpdate(BaseSchema):
    user_id: UUID | None = None
    status: VouchStatEnum | None = None
    redeemed_at: datetime | None = None

class VoucherNFTOut(BaseDBSchema):
    template_id: UUID
    user_id: UUID | None
    asset_id: MediumStr
    status: VouchStatEnum
    redeemed_at: datetime | None
