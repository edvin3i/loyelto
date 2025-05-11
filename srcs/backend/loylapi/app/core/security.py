import functools, httpx
from jose import jwt
from jose.utils import base64url_decode
from pydantic import BaseModel
from app.core.settings import settings

PRIVY_JWKS = "https://auth.privy.io/.well-known/jwks.json"
ALGS = ["ES256"]


@functools.lru_cache(maxsize=1)
def _jwks():
    return httpx.get(PRIVY_JWKS, timeout=10).json()["keys"]


class TokenClaims(BaseModel):
    did: str
    sid: str

# kid-aware JWKS validation; prevents key-mix-attacks

def _get_signing_key(token: str) -> dict:
    headers = jwt.get_unverified_header(token)
    kid = headers["kid"]
    for key in _jwks():
        if key["kid"] == kid:
            return key
    raise ValueError("No matching JWK")


def verify_privy_token(token: str) -> TokenClaims:
    key = _get_signing_key(token)
    payload = jwt.decode(
        token,
        key,
        algorithms=ALGS,
        audience=settings.PRIVY_APP_ID,
        issuer="https://auth.privy.io",
    )
    return TokenClaims(did=payload["sub"], sid=payload["sid"])
