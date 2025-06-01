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
        try:
            # Step 1: Decode JWT to check ALL claims
            import json
            import base64
            
            parts = id_token.split('.')
            if len(parts) != 3:
                raise ValueError("Invalid JWT format")
            
            # Decode payload
            payload = parts[1]
            payload += '=' * (4 - len(payload) % 4)
            decoded_payload = base64.urlsafe_b64decode(payload)
            decoded_token = json.loads(decoded_payload)
            
            privy_id = decoded_token.get("sub")
            if not privy_id:
                raise ValueError("Privy ID not found in token.")
                
            # Log FULL JWT payload to see all claims
            print(f"✅ [PRIVY-CLIENT] Successfully decoded JWT for user: {privy_id}")
            print(f"🔍 [PRIVY-CLIENT] FULL JWT payload: {decoded_token}")
            
            # Check for email/phone in JWT claims
            jwt_email = decoded_token.get("email") or decoded_token.get("email_address") or decoded_token.get("user_email")
            jwt_phone = decoded_token.get("phone") or decoded_token.get("phone_number") or decoded_token.get("user_phone")
            
            print(f"🔍 [PRIVY-CLIENT] JWT email claims: {jwt_email}")
            print(f"🔍 [PRIVY-CLIENT] JWT phone claims: {jwt_phone}")
            
            # If we have email/phone in JWT, use it directly
            if jwt_email or jwt_phone:
                print(f"✅ [PRIVY-CLIENT] Found user data in JWT, skipping API call")
                return PrivyUser(
                    id=privy_id,
                    embedded_wallet=None,
                    email=jwt_email,
                    phone=jwt_phone
                )
            
            # Step 2: Try to fetch additional data from Privy API
            try:
                print(f"🔄 [PRIVY-CLIENT] Attempting to fetch user data from Privy API...")
                print(f"🔍 [PRIVY-CLIENT] URL: {self.base}/users/{privy_id}")
                print(f"🔍 [PRIVY-CLIENT] Auth: {self.app_id}:{self.api_key[:10]}...")
                
                r = await self._req("GET", f"{self.base}/users/{privy_id}")
                d: dict[str, Any] = r.json()
                
                print(f"✅ [PRIVY-CLIENT] Successfully fetched user data from Privy API")
                print(f"🔍 [PRIVY-CLIENT] User data keys: {list(d.keys())}")
                
                # Extract wallet and contact info
                wallets = d.get("wallets", {}).get("solana", [])
                embedded = wallets[0]["address"] if wallets else None
                
                return PrivyUser(
                    id=d["id"],
                    embedded_wallet=embedded,
                    email=d.get("email"),
                    phone=d.get("phone")
                )
                
            except Exception as api_error:
                print(f"⚠️ [PRIVY-CLIENT] Failed to fetch from Privy API: {api_error}")
                print(f"🔍 [PRIVY-CLIENT] Error type: {type(api_error).__name__}")
                
                # Check if it's a 404 specifically
                if hasattr(api_error, 'response') and api_error.response.status_code == 404:
                    print(f"❌ [PRIVY-CLIENT] User not found in Privy (404) - using JWT data only")
                elif hasattr(api_error, 'response'):
                    print(f"❌ [PRIVY-CLIENT] HTTP {api_error.response.status_code} error from Privy API")
                else:
                    print(f"❌ [PRIVY-CLIENT] Network/other error: {api_error}")
                
                # Step 3: Fallback to JWT-only data
                print(f"🔄 [PRIVY-CLIENT] Falling back to JWT-only user data")
                return PrivyUser(
                    id=privy_id,
                    embedded_wallet=None,  # Will be created later if needed
                    email=None,            # Can be updated via webhooks or user input
                    phone=None             # Can be updated via webhooks or user input
                )
                
        except Exception as e:
            print(f"💥 [PRIVY-CLIENT] Failed to process id_token: {e}")
            raise ValueError(f"Failed to decode id_token: {str(e)}")

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
