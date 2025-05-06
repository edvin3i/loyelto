from app.schemas.base import BaseSchema, BaseDBSchema
from pydantic import EmailStr
from app.schemas.types import PhoneStr, PrivyIDStr


class UserCreate(BaseSchema):
    privy_id: PrivyIDStr
    phone: PhoneStr
    email: EmailStr


class UserUpdate(BaseSchema):
    phone: PhoneStr | None = None
    email: EmailStr | None = None


class UserOut(BaseDBSchema):
    privy_id: PrivyIDStr
    phone: PhoneStr
    email: EmailStr
