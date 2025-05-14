from app.api.crud_router import create_crud_router
from app.services.balance import balance_service
from app.schemas.balance import BalanceCreate, BalanceUpdate, BalanceOut

router = create_crud_router(
    crud=balance_service.crud,
    create_schema=BalanceCreate,
    update_schema=BalanceUpdate,
    out_schema=BalanceOut,
    prefix="/balances",
    tags=["balances"],
)
