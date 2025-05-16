from app.api.crud_router import create_crud_router
from app.services.wallet import wallet_service
from app.schemas.wallet import WalletCreate, WalletUpdate, WalletOut

router = create_crud_router(
    crud=wallet_service.crud,
    create_schema=WalletCreate,
    update_schema=WalletUpdate,
    out_schema=WalletOut,
    prefix="/wallets",
    tags=["wallets"],
)
