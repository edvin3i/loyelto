from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.base import BaseService

crud_user = CRUDBase[User, UserCreate, UserUpdate](User)

class UserService(BaseService[User, UserCreate, UserUpdate]):
    pass

user_service = UserService(crud_user)