from __future__ import annotations
import httpx, base64, hmac, hashlib
from typing import Any
from pydantic import BaseModel


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

    # ---------- helpers ----------
    async def _req(self, method: str, url: str, **kw) -> httpx.Response:
        kw.setdefault("auth", self._auth)
        kw.setdefault("headers", self._hdr)
        async with httpx.AsyncClient(timeout=20) as c:
            r = await c.request(method, url, **kw)
        r.raise_for_status()
        return r

    # ---------- public API ----------
    async def exchange_code(self, code: str) -> str:
        r = await self._req("POST", f"{self.base}/auth/exchange-code", json={"code": code})
        return r.json()["userId"]

    async def get_user(self, privy_id: str) -> PrivyUser:
        r = await self._req("GET", f"{self.base}/users/{privy_id}")
        d: dict[str, Any] = r.json()
        wallets = d.get("wallets", {}).get("solana", [])
        embedded = wallets[0]["address"] if wallets else None
        return PrivyUser(id=d["id"], embedded_wallet=embedded, email=d.get("email"), phone=d.get("phone"))

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


def verify_sig(sig: str | None, body: bytes, secret: str) -> bool:
    if not sig:
        return False
    mac = hmac.new(secret.encode(), body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64decode(sig), mac)
