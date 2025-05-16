from app.api.crud_router import create_crud_router
from app.services.token import token_service
from app.schemas.token import TokenCreate, TokenUpdate, TokenOut

router = create_crud_router(
    crud=token_service.crud,
    create_schema=TokenCreate,
    update_schema=TokenUpdate,
    out_schema=TokenOut,
    prefix="/tokens",
    tags=["tokens"],
)
