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

# for admin panel
from app.admin import setup_admin
from app.db.session import engine
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from starlette.middleware.sessions import SessionMiddleware


bearer = HTTPBearer(auto_error=False)


async def get_current_user_from_token(creds=Depends(bearer)):
    """Extract user claims from verified token"""
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        claims = verify_privy_token(creds.credentials)
        return claims
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


def current_user(creds=Depends(bearer)):
    if not creds:
        raise HTTPException(status_code=401)
    try:
        return verify_privy_token(creds.credentials)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


app = FastAPI(**settings.fastapi_kwargs)
app.state.settings = settings          # type: ignore[attr-defined]

app.add_middleware(
    ProxyHeadersMiddleware, # type: ignore
    trusted_hosts="*",
)

app.add_middleware(
    SessionMiddleware, # type: ignore
    secret_key=app.state.settings.ADMIN_SECRET_KEY,
)

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:8080",
    "https://stage.loyel.to",
    "https://api.stage.loyel.to",
]

app.add_middleware(
    CORSMiddleware, # type: ignore
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
# print(f"==================== {root} ====================")
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


admin = setup_admin(app, engine)


if __name__ == "__main__":
    import click
    from app.cli.admin import admin_cli

    @click.group()
    def cli():
        pass

    cli.add_command(admin_cli, name="admin")

    cli()
