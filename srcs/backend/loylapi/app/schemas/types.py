from symtable import Symbol

from pydantic import constr, conint, condecimal


def LimitedStr(min_length: int = 1, max_length: int = 128):
    return constr(min_length=min_length, max_length=max_length)


def ExactLenStr(length: int = 64):
    return constr(min_length=length, max_length=length)


PrivyIDStr = ExactLenStr(64)
PhoneStr = LimitedStr(5, 32)
NameStr = LimitedStr(1, 128)
SlugStr = LimitedStr(1, 64)
TextAreaStr = LimitedStr(1, 512)
CountryStr = LimitedStr(2, 64)
CityStr = LimitedStr(1, 128)
AddressStr = LimitedStr(1, 128)
ZipCodeStr = LimitedStr(1, 12)
SymbolStr = LimitedStr(3, 6)
MintStr = ExactLenStr(64)
Decimals = conint(ge=0, le=9)
RateDecimals = condecimal(max_digits=18, decimal_places=6)
