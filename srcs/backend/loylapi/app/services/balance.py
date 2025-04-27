from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.balance import Balance
from app.schemas.balance import BalanceCreate, BalanceUpdate

crud_balance = CRUDBase[Balance, BalanceCreate, BalanceUpdate](Balance)

class BalanceService(BaseService[Balance, BalanceCreate, BalanceUpdate]):
    pass

balance_service = BalanceService(crud_balance)