from __future__ import annotations
import httpx, base64, hmac, hashlib
from typing import Any
from pydantic import BaseModel
from jose import jwt

class PrivyUser(BaseModel):
    id: str
    embedded_wallet: str | None = None
    email: str | None = None
    phone: str | None = None


class PrivyClient:
    """Thin async wrapper around Privy REST v1."""

    def __init__(self, app_id: str, api_key: str, cluster: str = "testnet"):
        self.app_id, self.api_key, self.cluster = app_id, api_key, cluster
        self.base = f"https://auth.privy.io/api/v1/apps/{app_id}"
        self._auth = httpx.BasicAuth(app_id, api_key)
        self._hdr = {"privy-app-id": app_id}

    # ---------- helpers -------------------------------------------------
    async def _req(self, method: str, url: str, **kw) -> httpx.Response:
        kw.setdefault("auth", self._auth)
        kw.setdefault("headers", self._hdr)
        async with httpx.AsyncClient(timeout=20) as c:
            r = await c.request(method, url, **kw)
        r.raise_for_status()
        return r

    # ---------- public API ---------------------------------------------
    async def exchange_code(self, code: str) -> str:
        r = await self._req("POST", f"{self.base}/auth/exchange-code", json={"code": code})
        return r.json()["userId"]

    async def get_user(self, privy_id: str) -> PrivyUser:
        r = await self._req("GET", f"{self.base}/users/{privy_id}")
        data: dict[str, Any] = r.json()
        wallets = data.get("wallets", {}).get("solana", [])
        embedded = wallets[0]["address"] if wallets else None
        return PrivyUser(
            id=data["id"],
            embedded_wallet=embedded,
            email=data.get("email"),
            phone=data.get("phone"),
        )

    async def create_wallets(self, privy_id: str) -> str:
        payload = {"createSolanaWallet": True, "createEthereumWallet": False, "cluster": self.cluster}
        r = await self._req("POST", f"{self.base}/users/{privy_id}/wallets", json=payload)
        return r.json()["wallets"]["solana"][0]["address"]

    async def sign_transaction(self, wallet_address: str, tx_b64: str) -> str:
        """Returns full signed transaction as base64 string."""
        payload = {
            "method": "signTransaction",
            "params": {"transaction": tx_b64, "encoding": "base64", "cluster": self.cluster},
        }
        r = await self._req("POST", f"{self.base}/wallets/{wallet_address}/rpc", json=payload)
        return r.json()["result"]["signedTransaction"]  # full tx b64


    async def debug_privy_connection(self) -> dict:
        """Debug helper to test Privy API connection and credentials."""
        debug_info = {
            "app_id": self.app_id,
            "base_url": self.base,
            "api_key_length": len(self.api_key) if self.api_key else 0,
            "api_key_prefix": self.api_key[:10] + "..." if self.api_key else "None",
        }
        
        try:
            # Test basic API connectivity
            print(f"🔍 [DEBUG] Testing Privy API connectivity...")
            print(f"🔍 [DEBUG] App ID: {self.app_id}")
            print(f"🔍 [DEBUG] Base URL: {self.base}")
            print(f"🔍 [DEBUG] API Key: {debug_info['api_key_prefix']}")
            
            # Try to make a simple request (this might also fail, but will give us more info)
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.get(
                    f"{self.base}/users",  # Try listing users endpoint
                    auth=self._auth,
                    headers=self._hdr
                )
                
            debug_info["api_test"] = {
                "status": response.status_code,
                "headers": dict(response.headers)
            }
            
            print(f"✅ [DEBUG] API test successful: {response.status_code}")
            
        except Exception as e:
            debug_info["api_test_error"] = str(e)
            print(f"❌ [DEBUG] API test failed: {e}")
        
        return debug_info

    async def get_user_by_token(self, id_token: str) -> PrivyUser:
        """Return the currently‑authenticated user (email & phone) using an **idToken**.More actions

               This avoids the paid webhooks – we hit `/users/id` with the bearer idToken
               and immediately get profile data on the free tier.
        """
        try:
            decoded_token = jwt.decode(id_token,
                                       options={"verify_signature": False})
            # Use get_unverified_claims instead of decode when we don't want to verify signature
            decoded_token = jwt.get_unverified_claims(id_token)
            privy_id = decoded_token.get("sub")
            if not privy_id:
                raise ValueError("Privy ID not found in token.")
        except Exception as e:
            raise ValueError(f"Failed to decode id_token: {str(e)}")

        # Fetch user data using the Privy DID
        r = await self._req("GET", f"{self.base}/users/{privy_id}")
        d: dict[str, Any] = r.json()
        wallets = d.get("wallets", {}).get("solana", [])
        embedded = wallets[0]["address"] if wallets else None
        return PrivyUser(
            id=d["id"],
            embedded_wallet=embedded,
            email=d.get("email"),
            phone=d.get("phone")
        )

    async def get_user_by_did(did: str, app_id: str, app_secret: str):
        url = f"https://auth.privy.io/api/v1/users/{did}"
        credentials = f"{app_id}:{app_secret}"
        headers = {
            "Authorization": f"Basic {base64.b64encode(credentials.encode()).decode()}",
            "privy-app-id": app_id
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(
                f"Failed to fetch user: {response.status_code} - {response.text}")


# ---------- utilities --------------------------------------------------

def verify_sig(sig: str | None, body: bytes, secret: str) -> bool:
    if not sig:
        return False
    mac = hmac.new(secret.encode(), body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64decode(sig), mac)
