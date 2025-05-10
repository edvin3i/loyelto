from sqlalchemy import select
from pydantic import EmailStr
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.base import BaseService

crud_user = CRUDBase[User, UserCreate, UserUpdate](User)


class UserService(BaseService[User, UserCreate, UserUpdate]):
    async def create_or_get(
        self, db, *, privy_id: str, email: EmailStr, phone: str
    ) -> User:
        """
        Return existing user by privy_id or create a new one.
        """
        q = select(User).where(User.privy_id == privy_id)
        res = await db.execute(q)
        user = res.scalar_one_or_none()
        if user:
            return user
        payload = UserCreate(privy_id=privy_id, email=email, phone=phone)
        return await self.create(db, payload)

    async def get_by_privy(self, db, privy_id: str) -> User | None:
        """
        Fetch a user by privy_id, or return None if not found.
        """
        q = select(User).where(User.privy_id == privy_id)
        res = await db.execute(q)
        return res.scalar_one_or_none()


user_service = UserService(crud_user)
