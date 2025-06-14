from fastapi import APIRouter, Depends, Query
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.api.deps import get_db
from app.services.tx_history import tx_history_service

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/user/{user_id}", response_model=List[dict])
async def user_history(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
):
    return await tx_history_service.list_user(db, user_id, limit=limit)
