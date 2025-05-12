from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.balance import Balance
from app.schemas.balance import BalanceCreate, BalanceUpdate

crud_balance = CRUDBase[Balance, BalanceCreate, BalanceUpdate](Balance)


class BalanceService(BaseService[Balance, BalanceCreate, BalanceUpdate]):
    async def get_balance(self, db: AsyncSession, wallet, token) -> int:
        q = select(Balance).where(
            Balance.wallet_id == wallet.id, Balance.token_id == token.id
        )
        res = await db.execute(q)
        bal = res.scalar_one_or_none()
        return bal.amount if bal else 0

    async def adjust_balance(
        self, db: AsyncSession, wallet, token, delta: int
    ) -> Balance:
        q = select(Balance).where(
            Balance.wallet_id == wallet.id, Balance.token_id == token.id
        )
        res = await db.execute(q)
        bal = res.scalar_one_or_none()
        if bal is None:
            bal = Balance(wallet_id=wallet.id, token_id=token.id, amount=0)
            db.add(bal)
        bal.amount += delta
        await db.flush()
        return bal


balance_service = BalanceService(crud_balance)
