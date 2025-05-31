from sqlalchemy import select
from typing import Optional
from pydantic import EmailStr
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.base import BaseService

crud_user = CRUDBase[User, UserCreate, UserUpdate](User)


class UserService(BaseService[User, UserCreate, UserUpdate]):
    """Service wrapper with *create‑or‑get* util that also back‑fills missing
    e‑mail / phone when data becomes available later."""

    async def create_or_get(
        self,
        db,
        *,
        privy_id: str,
        email: Optional[EmailStr] = None,
        phone: Optional[str] = None,
    ) -> User:
        # 1) Attempt to fetch existing user
        q = select(User).where(User.privy_id == privy_id)
        res = await db.execute(q)
        user = res.scalar_one_or_none()

        if user:
            # 2) Back‑fill e‑mail / phone if they were empty previously
            patch: dict[str, Optional[str]] = {}
            if not user.email and email:
                patch["email"] = email
            if not user.phone and phone:
                patch["phone"] = phone
            if patch:
                user = await self.update(db, user, UserUpdate(**patch))  # type: ignore[arg-type]
            return user

        # 3) No user – create a new one
        payload = UserCreate(privy_id=privy_id, email=email, phone=phone)
        return await self.create(db, payload)

    async def get_by_privy(self, db, privy_id: str) -> User | None:
        q = select(User).where(User.privy_id == privy_id)
        res = await db.execute(q)
        return res.scalar_one_or_none()


user_service = UserService(crud_user)