from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.transactions import SwapTx
from app.schemas.swap_tx import SwapTxCreate, SwapTxOut  # Out as Update

crud_swap_tx = CRUDBase[SwapTx, SwapTxCreate, SwapTxCreate](SwapTx)


class SwapTxService(BaseService[SwapTx, SwapTxCreate, SwapTxCreate]):
    pass


swap_tx_service = SwapTxService(crud_swap_tx)
