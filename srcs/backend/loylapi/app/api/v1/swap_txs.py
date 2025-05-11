from app.api.crud_router import create_crud_router
from app.services.swap_tx import swap_tx_service
from app.schemas.swap_tx import SwapTxCreate, SwapTxOut

router = create_crud_router(
    crud=swap_tx_service.crud,
    create_schema=SwapTxCreate,
    out_schema=SwapTxOut,
    prefix="/swap_txs",
    tags=["swap_txs"],
)
