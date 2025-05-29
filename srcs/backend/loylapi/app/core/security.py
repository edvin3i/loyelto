import functools, httpx, time
from jose import jwt
from jose.utils import base64url_decode
from typing import List, Dict
from pydantic import BaseModel
from app.core.settings import settings

# PRIVY_JWKS = "https://auth.privy.io/.well-known/jwks.json"
ALGS = ["ES256"]
_JWKS_CACHE: tuple[float, List[Dict]] = (0.0, [])


@functools.lru_cache(maxsize=1)
def _jwks() -> List[Dict]:
    """
    Fetch JWKS with 10-minute TTL cache.
    """
    global _JWKS_CACHE
    now = time.time()
    ts, keys = _JWKS_CACHE
    if now - ts < 600 and keys:
        return keys

    r = httpx.get(settings.PRIVY_JWKS, timeout=10)
    r.raise_for_status()
    data = r.json()
    # garantee that keys will be list[dict]
    new_keys = data.get("keys") or []
    if not isinstance(new_keys, list):
        new_keys = []
    # cache update

    _JWKS_CACHE = (now, new_keys)
    return new_keys


class TokenClaims(BaseModel):
    did: str
    sid: str


# kid-aware JWKS validation; prevents key-mix-attacks


def _get_signing_key(token: str) -> dict:
    headers = jwt.get_unverified_header(token)
    kid = headers["kid"]
    for key in _jwks():
        if key.get("kid") == kid:
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
