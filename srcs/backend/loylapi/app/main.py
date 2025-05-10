from typing import Union
from pathlib import Path
from fastapi import FastAPI
from app.core.settings import settings
from app.services.exchange_client import ExchangeClient
from app.api.router import router as api_router

app = FastAPI()

app.include_router(api_router)


exchange_client = ExchangeClient(
    rpc_url=settings.SOLANA_RPC_URL,
    payer_keypair=settings.treasury_kp,
    program_id=settings.exchange_program_pk,
    idl_path=Path("anchor/exchange/target/idl/exchange.json"),
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
