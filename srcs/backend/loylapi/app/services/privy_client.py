import httpx, hmac, hashlib, base64, time
from pydantic import BaseModel


class PrivyUser(BaseModel):
    id: str
    wallet_address: str  # EVM, only on front
    embedded_wallet: str  # SPL pubkey (will come from Privy Solana extension)


class PrivyClient:
    def __init__(self, app_id: str, api_key: str):
        self.app_id, self.api_key = app_id, api_key
        self.base = "https://auth.privy.io/v1"

    async def exchange_code(self, code: str) -> str:
        """
        Exchange temporary code to privy_id.
        """
        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{self.base}/exchange-code",  # check real addr later
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "app_id": self.app_id,
                    "code": code,
                },
            )
        r.raise_for_status()
        data = r.json()
        return data["id"]

    async def get_user(self, privy_id: str) -> PrivyUser:
        async with httpx.AsyncClient() as c:
            r = await c.get(
                f"{self.base}/users/{privy_id}",
                headers={"Authorization": f"Bearer {self.api_key}"},
            )
        r.raise_for_status()
        return PrivyUser(**r.json())


def verify_sig(sig: str | None, body: bytes, secret: str) -> bool:
    if not sig:
        return False
    comp = hmac.new(secret.encode(), body, hashlib.sha256).digest()
    return hmac.compare_digest(base64.b64decode(sig), comp)
