from decimal import Decimal
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Business

class RateService:
    async def set_rate(self, db: AsyncSession, biz_id: UUID, new_rate: Decimal):
        biz = await db.get(Business, biz_id)
        if not biz:
            raise ValueError("business not found")
        biz.rate_loyl = new_rate
        biz.loyalty_token.rate_loyl = new_rate
        await db.commit()

rate_service = RateService()
