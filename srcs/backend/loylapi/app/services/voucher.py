from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List
from app.models import VoucherNFT


class VoucherService:
    async def user_vouchers(self, db: AsyncSession, user_id: UUID) -> List[VoucherNFT]:
        stmt = select(VoucherNFT).where(VoucherNFT.user_id == user_id)
        res = await db.execute(stmt)
        return list(res.scalars())


voucher_service = VoucherService()
