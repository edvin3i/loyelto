from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.transactions import PointTx
from app.schemas.point_tx import PointTxCreate, PointTxOut  # use Out as Update

crud_point_tx = CRUDBase[PointTx, PointTxCreate, PointTxCreate](PointTx)


class PointTxService(BaseService[PointTx, PointTxCreate, PointTxCreate]):
    pass


point_tx_service = PointTxService(crud_point_tx)
