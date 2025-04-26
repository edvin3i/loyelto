from app.schemas.base import BaseSchema, BaseDBSchema
from pydantic import EmailStr, AnyUrl
from app.schemas.types import (
    NameStr,
    SlugStr,
    TextAreaStr,
    CountryStr,
    CityStr,
    AddressStr,
    ZipCodeStr,
)


class BusinessCreate(BaseSchema):
    name: NameStr
    slug: SlugStr
    logo_url: AnyUrl | None = None
    owner_email: EmailStr
    description: TextAreaStr
    country: CountryStr
    city: CityStr
    address: AddressStr
    zip_code: ZipCodeStr


class BusinessUpdate(BaseSchema):
    name: NameStr | None = None
    slug: SlugStr | None = None
    logo_url: AnyUrl | None = None
    owner_email: EmailStr | None = None
    description: TextAreaStr | None = None
    country: CountryStr | None = None
    city: CityStr | None = None
    address: AddressStr | None = None
    zip_code: ZipCodeStr | None = None


class BusinessOut(BaseDBSchema):
    name: NameStr
    slug: SlugStr
    logo_url: AnyUrl | None
    owner_email: EmailStr
    description: TextAreaStr
    country: CountryStr
    city: CityStr
    address: AddressStr
    zip_code: ZipCodeStr
