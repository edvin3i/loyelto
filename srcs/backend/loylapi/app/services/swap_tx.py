from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.transactions import SwapTx
from app.schemas.swap_tx import SwapTxCreate, SwapTxOut  # Out as Update
from sqlalchemy.ext.asyncio import AsyncSession
from app.tasks.onchain import swap_task


crud_swap_tx = CRUDBase[SwapTx, SwapTxCreate, SwapTxCreate](SwapTx)


class SwapTxService(BaseService[SwapTx, SwapTxCreate, SwapTxCreate]):
    async def create(self, db: AsyncSession, payload: SwapTxCreate) -> SwapTx:
        record = await super().create(db, payload)
        # Fire-and-forget on-chain execution
        swap_task.delay(str(record.id))
        return record


swap_tx_service = SwapTxService(crud_swap_tx)
