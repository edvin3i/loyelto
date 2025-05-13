import httpx, hmac, hashlib, base64
from pydantic import BaseModel


class PrivyUser(BaseModel):
    id: str
    wallet_address: str  # EVM, only on front
    embedded_wallet: str  # SPL pubkey (will come from Privy Solana extension)



# app/services/privy_client.py
import httpx, hmac, hashlib, base64
from typing import Any
from pydantic import BaseModel


class PrivyUser(BaseModel):
    id: str
    embedded_wallet: str | None = None
    email: str | None = None
    phone: str | None = None


class PrivyClient:
    """
    Thin async wrapper around Privy REST API v1.
    """

    def __init__(self, app_id: str, api_key: str, cluster: str = "testnet"):
        self.app_id = app_id
        self.api_key = api_key
        self.base = f"https://auth.privy.io/api/v1/apps/{app_id}"
        self.cluster = cluster
        self._auth = httpx.BasicAuth(app_id, api_key)
        self._headers = {"privy-app-id": self.app_id}

    # ---------------- low-level helpers ----------------
    async def _get(self, url: str, **kw) -> httpx.Response:
        kw.setdefault("auth", self._auth)
        kw.setdefault("headers", self._headers)
        async with httpx.AsyncClient() as c:
            r = await c.get(url, **kw)
        r.raise_for_status()
        return r

    async def _post(self, url: str, **kw) -> httpx.Response:
        kw.setdefault("auth", self._auth)
        kw.setdefault("headers", self._headers)
        async with httpx.AsyncClient() as c:
            r = await c.post(url, **kw)
        r.raise_for_status()
        return r

    # ---------------- public API ----------------
    async def exchange_code(self, code: str) -> str:
        r = await self._post(
            f"{self.base}/auth/exchange-code", json={"code": code}
        )
        return r.json()["userId"]

    async def get_user(self, privy_id: str) -> PrivyUser:
        r = await self._get(f"{self.base}/users/{privy_id}")
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
        payload = {
            "createSolanaWallet": True,
            "createEthereumWallet": False,
            "cluster": self.cluster,
        }
        r = await self._post(
            f"{self.base}/users/{privy_id}/wallets", json=payload
        )
        data = r.json()
        return data["wallets"]["solana"][0]["address"]

    async def sign_transaction(
        self,
        wallet_address: str,
        transaction_b64: str,
        encoding: str = "base64",
    ) -> str:
        url = f"{self.base}/wallets/{wallet_address}/rpc"
        payload = {
            "method": "signTransaction",
            "params": {
                "transaction": transaction_b64,
                "encoding": encoding,
                "cluster": self.cluster,
            },
        }
        r = await self._post(url, json=payload)
        return r.json()["result"]["signature"]


def verify_sig(sig: str | None, body: bytes, secret: str) -> bool:
    if not sig:
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64decode(sig), expected)




#
# class PrivyClient:
#     def __init__(self, app_id: str, api_key: str):
#         self.app_id = app_id
#         self.api_key = api_key
#         self.base = f"https://auth.privy.io/api/v1/apps/{app_id}"
#         # BasicAuth + header privy-app-id for all requests
#         self._auth = httpx.BasicAuth(app_id, api_key)
#         self._headers = {"privy-app-id": self.app_id}
#
#     async def _post(self, url: str, **kw) -> httpx.Response:
#         kw.setdefault("auth", self._auth)
#         kw.setdefault("headers", self._headers)
#         async with httpx.AsyncClient() as c:
#             r = await c.post(url, **kw)
#         r.raise_for_status()
#         return r
#
#     async def exchange_code(self, code: str) -> str:
#         """
#         Exchange temporary code to privy_id.
#         """
#         r = await self._post(
#             f"{self.base}/auth/exchange-code",
#             json={"code": code},
#         )
#         return r.json()["userId"]
#
#     async def get_user(self, privy_id: str) -> PrivyUser:
#         """
#         Get user data by privy_id.
#         """
#         r = await self._post(f"{self.base}/users/{privy_id}")
#         return PrivyUser(**r.json())
#
#     async def create_wallets(self, privy_id: str) -> str:
#         """
#         Create embedded Solana wallet for given user.
#         """
#         payload = {
#             "createSolanaWallet": True,
#             "createEthereumWallet": False,
#         }
#         r = await self._post(
#             f"{self.base}/users/{privy_id}/wallets",
#             json=payload,
#         )
#         data = r.json()
#         return data["wallets"]["solana"][0]["address"]
#
#     async def sign_transaction(
#         self,
#         wallet_address: str,
#         transaction_b64: str,
#         encoding: str = "base64",
#     ) -> str:
#         """
#         Sign a Base64-encoded transaction via Privy embedded wallet.
#         Returns signed transaction as Base64 string.
#         """
#         url = f"{self.base}/wallets/{wallet_address}/rpc"
#         # for RPC-requestsв Privy still BasicAuth+privy-app-id
#         payload = {
#             "method": "signTransaction",
#             "params": {"transaction": transaction_b64, "encoding": encoding},
#         }
#         r = await self._post(url, json=payload)
#         return r.json()["result"]["signature"]
#

def verify_sig(sig: str | None, body: bytes, secret: str) -> bool:
    if not sig:
        return False
    expected = hmac.new(secret.encode(), body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64decode(sig), expected)
