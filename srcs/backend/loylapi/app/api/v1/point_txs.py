from app.api.crud_router import create_crud_router
from app.services.point_tx import point_tx_service
from app.schemas.point_tx import PointTxCreate, PointTxOut

router = create_crud_router(
    crud=point_tx_service.crud,
    create_schema=PointTxCreate,
    out_schema=PointTxOut,
    prefix="/point_txs",
    tags=["point_txs"],
)
