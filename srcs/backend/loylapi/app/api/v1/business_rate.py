from decimal import Decimal
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.rate import rate_service
from app.api.deps import get_db

router = APIRouter(prefix="/business_rate", tags=["businesses"])


@router.post("/{biz_id}", status_code=status.HTTP_204_NO_CONTENT)
async def set_rate(biz_id: UUID, new_rate: Decimal, db: AsyncSession = Depends(get_db)):
    await rate_service.set_rate(db, biz_id, new_rate)
