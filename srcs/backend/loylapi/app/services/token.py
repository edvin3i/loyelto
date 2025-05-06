from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.token import Token
from app.schemas.token import TokenCreate, TokenUpdate

crud_token = CRUDBase[Token, TokenCreate, TokenUpdate](Token)

class TokenService(BaseService[Token, TokenCreate, TokenUpdate]):
    pass

token_service = TokenService(crud_token)