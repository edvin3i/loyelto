from typing import Generic, Type, TypeVar
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.sql import ColumnElement
from pydantic import BaseModel
from app.db.base import Base
from uuid import UUID

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
OutSchemaType = TypeVar("OutSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):  # , OutSchema
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def create(self, db: AsyncSession, obj_in: CreateSchemaType) -> ModelType:
        obj = self.model(**obj_in.model_dump())
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def read(self, db: AsyncSession, id_: str | UUID) -> ModelType | None:
        id_ = UUID(str(id_))
        res = await db.execute(select(self.model).where(id_ == self.model.id))
        return res.scalar_one_or_none()

    async def read_many(
        self,
        db: AsyncSession,
        start: int = 0,
        limit: int = 10,
        filters: list[ColumnElement[bool]] | None = None,
    ) -> list[ModelType]:
        data = select(self.model)
        if filters:
            for condition in filters:
                data = data.where(condition)
        data = data.offset(start).limit(limit)
        res = await db.execute(data)
        return list(res.scalars())

    async def update(
        self, db: AsyncSession, db_obj: ModelType, obj_in: UpdateSchemaType
    ) -> ModelType:
        for k, v in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, k, v)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id_: str | UUID) -> None:
        id_ = UUID(str(id_))
        await db.execute(delete(self.model).where(id_ == self.model.id))
        await db.commit()
