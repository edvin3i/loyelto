from typing import Annotated, List, Union
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.services.user import user_service
from app.schemas.user import UserCreate, UserUpdate, UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserOut:
    return await user_service.create(db, payload)


@router.get("/{user_id}", response_model=UserOut)
async def read_user(
    user_id: Union[str, UUID],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserOut:
    user = await user_service.read(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.get("/", response_model=List[UserOut])
async def read_users(
    db: Annotated[AsyncSession, Depends(get_db)],
    start: int = 0,
    limit: int = 10,
) -> List[UserOut]:
    return await user_service.read_many(db, start=start, limit=limit)


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: Union[str, UUID],
    payload: UserUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserOut:
    user = await user_service.read(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return await user_service.update(db, user, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: Union[str, UUID],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    user = await user_service.read(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    await user_service.delete(db, user_id)
