from uuid import UUID
from typing import Generic, TypeVar
from pydantic import BaseModel
from app.crud.base import CRUDBase
from sqlalchemy.ext.asyncio import AsyncSession

M = TypeVar("M")
C = TypeVar("C", bound=BaseModel)
U = TypeVar("U", bound=BaseModel)

class BaseService(Generic[M, C, U]):
    def __init__(self, crud: CRUDBase[M, C, U]):
        self.crud = crud

    async def create(self, db: AsyncSession, payload: C) -> M:
        return await self.crud.create(db, payload)

    async def read(self, db: AsyncSession, id: str | UUID) -> M | None:
        return await self.crud.read(db, id)

    async def read_many(
            self, db: AsyncSession, *, start: int = 0, limit: int = 10, filters=None
    ) -> list[M]:
        return await self.crud.read_many(db, start=start, limit=limit, filters=filters)

    async def update(self, db: AsyncSession, db_obj: M, payload: U) -> M:
        return await self.crud.update(db, db_obj, payload)

    async def delete(self, db: AsyncSession, id: str | UUID) -> None:
        await self.crud.delete(db, id)