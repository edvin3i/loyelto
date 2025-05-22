from typing import Union
from pathlib import Path
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from app.core.settings import settings
from app.core.security import verify_privy_token
from app.api.v1.auth import router as auth_router
from app.api.router import router as v1_router
from app.api.ws import router as ws_router
from app.services.exchange_client import ExchangeClient

bearer = HTTPBearer(auto_error=False)


def current_user(creds=Depends(bearer)):
    if not creds:
        raise HTTPException(status_code=401)
    return verify_privy_token(creds.credentials)


app = FastAPI(**settings.fastapi_kwargs)


from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:8080",
    "https://stage.loyel.to",
    "https://api.stage.loyel.to",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 1) public endpoints ver 1
public_v1 = APIRouter(prefix="/api/v1")
public_v1.include_router(auth_router)  # только /auth
app.include_router(public_v1)


# 2) protected endpoints ver 1
protected_v1 = APIRouter(prefix="/api/v1", dependencies=[Depends(current_user)])
protected_v1.include_router(v1_router)  # users, businesses, tokens и т.д.
app.include_router(protected_v1)

app.include_router(ws_router)


# initializationn of Anchor client
root = Path(__file__).parent.parent.parent
print(f"==================== {root} ====================")
idl_path = root / "app" / "anchor" / "target" / "idl" / "exchange.json"

# print(idl_path.exists(), idl_path.read_text()[:200])

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
