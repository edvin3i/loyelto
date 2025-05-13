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
    RateDecimals,
    RatingInt,
    OwnerPrivKey,
)



class BusinessCreate(BaseSchema):
    name: NameStr
    slug: SlugStr
    logo_url: AnyUrl | None = None
    owner_email: EmailStr
    owner_privkey: OwnerPrivKey
    description: TextAreaStr
    rating: RatingInt | None = None
    country: CountryStr
    city: CityStr
    address: AddressStr
    zip_code: ZipCodeStr
    rate_loyl: RateDecimals


class BusinessUpdate(BaseSchema):
    name: NameStr | None = None
    slug: SlugStr | None = None
    logo_url: AnyUrl | None = None
    owner_email: EmailStr | None = None
    owner_privkey: OwnerPrivKey | None = None
    description: TextAreaStr | None = None
    rating: RatingInt | None = None
    country: CountryStr | None = None
    city: CityStr | None = None
    address: AddressStr | None = None
    zip_code: ZipCodeStr | None = None
    rate_loyl: RateDecimals | None = None


class BusinessOut(BaseDBSchema):
    name: NameStr
    slug: SlugStr
    logo_url: AnyUrl | None
    owner_email: EmailStr
    owner_privkey: OwnerPrivKey
    description: TextAreaStr
    rating: RatingInt
    country: CountryStr
    city: CityStr
    address: AddressStr
    zip_code: ZipCodeStr
    rate_loyl: RateDecimals
