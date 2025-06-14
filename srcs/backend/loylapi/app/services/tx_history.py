from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.transactions import PointTx, SwapTx


class TxHistoryService:
    async def list_user(
        self, db: AsyncSession, user_id: UUID, *, limit: int = 50
    ) -> List[dict]:
        stmt = (
            select(PointTx)
            .join(PointTx.wallet)
            .where(PointTx.wallet.has(user_id=user_id))
        )
        stmt = stmt.order_by(PointTx.created_at.desc()).limit(limit)
        p_txs = (await db.execute(stmt)).scalars()

        stmt2 = (
            select(SwapTx)
            .where(SwapTx.user_id == user_id)
            .order_by(SwapTx.created_at.desc())
            .limit(limit)
        )
        s_txs = (await db.execute(stmt2)).scalars()

        rows = [{"type": "point", **pt.__dict__} for pt in p_txs] + [
            {"type": "swap", **st.__dict__} for st in s_txs
        ]
        rows.sort(key=lambda r: r["created_at"], reverse=True)
        return rows


tx_history_service = TxHistoryService()
