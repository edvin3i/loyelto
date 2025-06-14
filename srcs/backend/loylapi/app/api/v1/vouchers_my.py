from fastapi import APIRouter, Depends
from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.services.voucher import voucher_service
from app.schemas.voucher import VoucherNFTOut

router = APIRouter(prefix="/vouchers", tags=["vouchers"])


@router.get("/user/{user_id}", response_model=List[VoucherNFTOut])
async def my_vouchers(user_id: UUID, db: AsyncSession = Depends(get_db)):
    return await voucher_service.user_vouchers(db, user_id)
