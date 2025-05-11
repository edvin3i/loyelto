import functools, httpx, jwt
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


def verify_privy_token(token: str) -> TokenClaims:
    payload = jwt.decode(
        token,
        key=_jwks(),
        algorithms=ALGS,
        audience=settings.PRIVY_APP_ID,
        issuer="privy.io",
    )
    return TokenClaims(did=payload["sub"], sid=payload["sid"])
