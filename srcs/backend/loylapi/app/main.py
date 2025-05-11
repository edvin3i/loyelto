from typing import Union
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer
from app.core.settings import settings
from app.core.security import verify_privy_token
from app.services.exchange_client import ExchangeClient
from app.api.router import router as api_router


bearer = HTTPBearer(auto_error=False)


def current_user(creds=Depends(bearer)):
    if not creds:
        raise HTTPException(status_code=401)
    return verify_privy_token(creds.credentials)


app = FastAPI(dependencies=[Depends(current_user)], **settings.fastapi_kwargs)
app.include_router(api_router)

root = Path(__file__).parent.parent.parent
idl_path = root / "anchor" / "target" / "idl" / "exchange.json"

print(idl_path.exists(), idl_path.read_text()[:200])

exchange_client = ExchangeClient(
    rpc_url=settings.SOLANA_RPC_URL,
    payer_keypair=settings.treasury_kp,
    program_id=settings.exchange_program_pk,
    idl_path=idl_path,
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
