from typing import Generic, Type, TypeVar
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel
from app.db.base import Base
from uuid import UUID

Model = TypeVar("Model", bound=Base)
CreateSchema = TypeVar("CreateSchema", bound=BaseModel)
UpdateSchema = TypeVar("UpdateSchema", bound=BaseModel)


class CRUDBase(Generic[Model, CreateSchema, UpdateSchema]):
    def __init__(self, model: Type[Model]):
        self.model = model

    async def create(self, db: AsyncSession, obj_in: CreateSchema) -> Model:
        obj = self.model(**obj_in.model_dump())
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def read(self, db: AsyncSession, id_: str | UUID) -> Model | None:
        id_ = UUID(str(id_))
        res = await db.execute(select(self.model).where(id_ == self.model.id))
        return res.scalar_one_or_none()

    async def read_many(self, db: AsyncSession, start: int = 0, limit: int = 10) -> list[Model]:
        data = select(self.model).offset(start).limit(limit)
        res = await db.execute(data)
        return list(res.scalars())

    async def update(self, db: AsyncSession, db_obj: Model, obj_in: UpdateSchema) -> Model:
        for k, v in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, k, v)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id_: str | UUID) -> None:
        id_ = UUID(str(id_))
        await db.execute(delete(self.model).where(id_ == self.model.id))
        await db.commit()