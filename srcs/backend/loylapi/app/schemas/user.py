from app.schemas.base import BaseSchema, BaseDBSchema
from pydantic import EmailStr, model_validator
from app.schemas.types import PhoneStr, PrivyIDStr


class UserCreate(BaseSchema):
    privy_id: PrivyIDStr
    phone: PhoneStr | None = None
    email: EmailStr | None = None


class UserUpdate(BaseSchema):
    phone: PhoneStr | None = None
    email: EmailStr | None = None


class UserOut(BaseDBSchema):
    privy_id: PrivyIDStr
    phone: PhoneStr | None = None
    email: EmailStr | None = None

    @model_validator(mode="after")
    def validete_contacts_present(self):
        if not self.email and not self.phone:
            raise ValueError("Either email or phone must be present")
        return self
