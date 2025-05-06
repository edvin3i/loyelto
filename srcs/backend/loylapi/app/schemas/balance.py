import datetime
from uuid import UUID
from app.schemas.types import GeZero
from app.schemas.base import BaseSchema, BaseDBSchema


class BalanceCreate(BaseSchema):
    wallet_id: UUID
    token_id: UUID
    amount: GeZero


class BalanceUpdate(BaseSchema):
    amount: GeZero


class BalanceOut(BaseDBSchema):
    wallet_id: UUID
    token_id: UUID
    amount: GeZero
    updated_at: datetime
