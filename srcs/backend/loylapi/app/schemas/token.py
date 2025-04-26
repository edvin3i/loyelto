from uuid import UUID
from pydantic import AnyUrl
from app.schemas.base import BaseSchema, BaseDBSchema
from app.schemas.types import (
    MintStr,
    SymbolStr,
    Decimals,
    RateDecimals,
)


class TokenCreate(BaseSchema):
    mint: MintStr
    symbol: SymbolStr
    coin_logo_url: AnyUrl | None
    min_rate: RateDecimals | None
    max_rate: RateDecimals | None
    business_id: UUID | None = None
    settlement_token: bool | None = False
    decimals: Decimals = 2


class TokenUpdate(BaseSchema):
    coin_logo_url: AnyUrl | None
    min_rate: RateDecimals | None
    max_rate: RateDecimals | None


class TokenOut(TokenCreate, BaseDBSchema):
    pass
