from datetime import datetime
from pydantic import EmailStr
from app.schemas.base import BaseSchema, BaseDBSchema


class AdminCreate(BaseSchema):
    email: EmailStr
    password: str


class AdminUpdate(BaseSchema):
    email: EmailStr | None = None
    password: str | None = None
    is_active: bool | None = None


class AdminOut(BaseDBSchema):
    email: EmailStr
    is_totp_enabled: bool
    is_active: bool
    last_login: datetime | None
    created_at: datetime
    updated_at: datetime


class AdminTOTPSetup(BaseSchema):
    qr_uri: str
    secret: str


class AdminTOTPVerify(BaseSchema):
    code: str