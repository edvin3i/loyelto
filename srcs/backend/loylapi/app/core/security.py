import functools, httpx, time
from jose import jwt
from jose.utils import base64url_decode
from typing import List, Dict
from pydantic import BaseModel
from app.core.settings import settings

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
    if now - ts < 600 and keys:  # 10 minutes cache
        return keys

    url = settings.privy_jwks_url
    try:
        r = httpx.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        # Ensure keys is a list
        new_keys = data.get("keys") or []
        if not isinstance(new_keys, list):
            new_keys = []

        # Validate key structure
        for key in new_keys:
            if not all(k in key for k in ["kid", "kty"]):
                raise ValueError(f"Invalid key format: missing required fields")

        # Update cache
        _JWKS_CACHE = (now, new_keys)
        return new_keys
    except Exception as e:
        # If error, return old cache if available
        if keys:
            return keys
        raise RuntimeError(f"Failed to fetch JWKS: {e}")


class TokenClaims(BaseModel):
    did: str
    sid: str
    sub: str  # Subject (same as did)
    aud: str  # Audience (App ID)
    iss: str  # Issuer (privy.io)
    iat: int  # Issued at
    exp: int  # Expiration

    @property
    def privy_id(self) -> str:
        """Returns Privy ID without did:privy: prefix"""
        return self.did.replace("did:privy:", "")


# kid-aware JWKS validation; prevents key-mix-attacks


def _get_signing_key(token: str) -> dict:
    headers = jwt.get_unverified_header(token)
    kid = headers.get("kid")
    if not kid:
        raise ValueError("No kid in token header")

    for key in _jwks():
        if key.get("kid") == kid:
            return key

    # Force cache refresh and try again
    global _JWKS_CACHE
    _JWKS_CACHE = (0.0, [])

    for key in _jwks():
        if key.get("kid") == kid:
            return key

    raise ValueError(f"No matching JWK for kid: {kid}")


def verify_privy_token(token: str) -> TokenClaims:
    key = _get_signing_key(token)
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=ALGS,
            audience=settings.PRIVY_APP_ID,
            issuer="privy.io",
            options={"verify_exp": True},
        )
        return TokenClaims(
            did=payload["sub"],
            sid=payload.get("sid", ""),
            sub=payload["sub"],
            aud=payload["aud"],
            iss=payload["iss"],
            iat=payload["iat"],
            exp=payload["exp"],
        )
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidAudienceError:
        raise ValueError("Invalid audience")
    except jwt.InvalidIssuerError:
        raise ValueError("Invalid issuer")
    except Exception as e:
        raise ValueError(f"Token verification failed: {str(e)}")
