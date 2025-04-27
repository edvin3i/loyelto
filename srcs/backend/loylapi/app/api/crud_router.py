from uuid import UUID
from pydantic import BaseModel
from fastapi import (APIRouter, Depends, HTTPException, Query, status)
from typing import (Annotated, Type, TypeVar, Union, List)
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.crud.base import CRUDBase
from app.db.base import Base as ORMBase

ModelType = TypeVar("ModelType", bound=ORMBase)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
OutSchemaType = TypeVar("OutSchemaType", bound=BaseModel)


def create_crud_router(
    *,
    crud: CRUDBase[ModelType, CreateSchemaType, UpdateSchemaType],
    create_schema: Type[CreateSchemaType],
    update_schema: Type[UpdateSchemaType],
    out_schema: Type[OutSchemaType],
    prefix: str,
    tags: List[str]
):
    router = APIRouter(prefix=prefix, tags=tags)

    @router.post("/", response_model=out_schema, status_code=status.HTTP_201_CREATED)
    async def create_item(
        payload: create_schema, db: Annotated[AsyncSession, Depends(get_db)]
    ) -> ModelType:
        return await crud.create(db, payload)

    @router.get("/{item_id}", response_model=out_schema)
    async def read_item(
        item_id: Union[str, UUID], db: Annotated[AsyncSession, Depends(get_db)]
    ) -> ModelType:
        obj = await crud.read(db, item_id)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        return obj

    @router.get("/", response_model=List[out_schema])
    async def read_items(
            db: Annotated[AsyncSession, Depends(get_db)],
            start: int = Query(0, ge=0),
            limit: int = Query(10, ge=1, le=100)
    ) -> List[OutSchemaType]:
        return await crud.read_many(db, start=start, limit=limit)

    @router.patch("/{item_id}", response_model=out_schema)
    async def update_item(
        item_id: Union[str, UUID],
        payload: update_schema,
        db: Annotated[AsyncSession, Depends(get_db)],
    ) -> ModelType:
        obj = await crud.read(db, item_id)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        return await crud.update(db, obj, payload)

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_item(
        item_id: Union[str, UUID], db: Annotated[AsyncSession, Depends(get_db)]
    ) -> None:
        obj = await crud.read(db, item_id)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        await crud.delete(db, item_id)

    return router
