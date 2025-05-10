from uuid import UUID
from pydantic import BaseModel
from app.schemas.base import BaseSchema, BaseDBSchema


class WalletCreate(BaseSchema):
    user_id: UUID
    pubkey: str


class WalletUpdate(BaseSchema):
    pass


class WalletOut(BaseDBSchema):
    user_id: UUID
    pubkey: str
