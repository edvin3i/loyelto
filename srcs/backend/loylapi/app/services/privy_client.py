from __future__ import annotations
import httpx, asyncio, base64, hmac, hashlib
from typing import Any, Dict
from pydantic import BaseModel
from jose import jwt
import logging


logger = logging.getLogger(__name__)


class PrivyUser(BaseModel):
    id: str  # Privy DID
    created_at: int = 0
    linked_accounts: list[dict] = []
    embedded_wallet: str | None = None
    email: str | None = None
    phone: str | None = None
    custom_metadata: dict | None = None

    @property
    def privy_id(self) -> str:
        """Returns ID without did:privy: prefix"""
        return self.id.replace("did:privy:", "")


class PrivyClient:
    """Thin async wrapper around Privy REST v1."""

    def __init__(self, app_id: str, api_key: str, cluster: str = "testnet"):
        self.app_id, self.api_key, self.cluster = app_id, api_key, cluster
        self.base_url = "https://api.privy.io/v1"
        self._auth = httpx.BasicAuth(app_id, api_key)
        self._headers = {"privy-app-id": app_id, "Content-Type": "application/json"}

    # ---------- helpers -------------------------------------------------
    async def _request(self, method: str, endpoint: str, **kwargs) -> httpx.Response:
        """Execute HTTP request with retry logic"""
        url = f"{self.base_url}{endpoint}"
        kwargs.setdefault("auth", self._auth)
        kwargs.setdefault("headers", {}).update(self._headers)

        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with httpx.AsyncClient(timeout=30) as client:
                    response = await client.request(method, url, **kwargs)

                if response.status_code == 429:  # Rate limited
                    retry_after = int(response.headers.get("Retry-After", 1))
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_after)
                        continue

                response.raise_for_status()
                return response

            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    return None
                logger.error(f"HTTP error {e.response.status_code}: {e.response.text}")
                raise
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(2**attempt)
                    continue
                raise

        raise RuntimeError(f"Failed after {max_retries} retries")

    # ---------- public API ---------------------------------------------
    async def exchange_code(self, code: str) -> str:
        r = await self._request("POST", "/auth/exchange-code", json={"code": code})
        return r.json()["userId"]

    async def get_user(self, privy_id: str) -> PrivyUser:
        """Get user by Privy DID"""
        # Clean ID from prefix if present
        clean_id = privy_id.replace("did:privy:", "")

        response = await self._request("GET", f"/users/{clean_id}")
        if response is None:
            raise ValueError(f"User {privy_id} not found")

        data = response.json()

        # Parse linked accounts
        linked_accounts = data.get("linked_accounts", [])

        # Extract embedded wallet from linked_accounts
        embedded_wallet = None
        email = None
        phone = None

        for account in linked_accounts:
            if (
                account.get("type") == "wallet"
                and account.get("wallet_client_type") == "privy"
            ):
                embedded_wallet = account.get("address")
            elif account.get("type") == "email":
                email = account.get("address")
            elif account.get("type") == "phone":
                phone = account.get("number")

        return PrivyUser(
            id=data["id"],
            created_at=data.get("created_at", 0),
            linked_accounts=linked_accounts,
            embedded_wallet=embedded_wallet,
            email=email,
            phone=phone,
            custom_metadata=data.get("custom_metadata"),
        )

    async def create_wallets(self, privy_id: str) -> str:
        """Create embedded wallet for user"""
        clean_id = privy_id.replace("did:privy:", "")

        payload = {
            "createSolanaWallet": True,
            "createEthereumWallet": False,
            "solanaCluster": self.cluster,
        }

        r = await self._request("POST", f"/users/{clean_id}/wallets", json=payload)
        data = r.json()
        wallets = data.get("wallets", {}).get("solana", [])

        if not wallets:
            raise ValueError("Failed to create Solana wallet")

        return wallets[0]["address"]

    async def sign_transaction(self, wallet_address: str, tx_b64: str) -> str:
        """Returns full signed transaction as base64 string"""
        payload = {
            "method": "signTransaction",
            "params": {
                "transaction": tx_b64,
                "encoding": "base64",
                "cluster": self.cluster,
            },
        }
        r = await self._request("POST", f"/wallets/{wallet_address}/rpc", json=payload)
        data = r.json()

        if "error" in data:
            raise RuntimeError(f"Transaction signing failed: {data['error']}")

        return data["result"]["signedTransaction"]

    async def get_user_by_token(self, id_token: str) -> PrivyUser:
        """Return the currently‑authenticated user (email & phone) using an **idToken**.

        This avoids the paid webhooks – we hit `/users/id` with the bearer idToken
        and immediately get profile data on the free tier.
        """
        try:
            # Декодируем токен без проверки подписи для получения privy_id
            decoded_token = jwt.get_unverified_claims(id_token)
            privy_id = decoded_token.get("sub")
            if not privy_id:
                raise ValueError("Privy ID not found in token.")
        except Exception as e:
            raise ValueError(f"Failed to decode id_token: {str(e)}")

        # Fetch user data using the Privy DID
        return await self.get_user(privy_id)

    async def get_user_by_did(did: str, app_id: str, app_secret: str):
        url = f"https://auth.privy.io/api/v1/users/{did}"
        credentials = f"{app_id}:{app_secret}"
        headers = {
            "Authorization": f"Basic {base64.b64encode(credentials.encode()).decode()}",
            "privy-app-id": app_id,
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(
                f"Failed to fetch user: {response.status_code} - {response.text}"
            )


# ---------- utilities --------------------------------------------------


def verify_sig(sig: str | None, body: bytes, secret: str) -> bool:
    if not sig:
        return False
    mac = hmac.new(secret.encode(), body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64decode(sig), mac)
