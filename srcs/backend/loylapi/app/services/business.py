import base58
from solders.pubkey import Pubkey
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.business import Business
from app.schemas.business import BusinessCreate


crud_business = CRUDBase[Business, BusinessCreate, BusinessCreate](Business)


class BusinessService(BaseService[Business, BusinessCreate, BusinessCreate]):
    async def create(self, db: AsyncSession, payload: BusinessCreate) -> Business:
        # 1) create DB row – NO keys
        biz = Business(**payload.model_dump())
        db.add(biz)
        await db.commit()
        await db.refresh(biz)

        # 2) async mint via Celery (treasury signs)
        from app.tasks.business import mint_token_task
        mint_token_task.delay(str(biz.id))
        return biz

    # helper – can be reused by tasks
    def pda_for(self, business_id: str, program_id: Pubkey) -> tuple[Pubkey, int]:
        import uuid
        return Pubkey.find_program_address(
            [b"business", uuid.UUID(business_id).bytes],
            program_id,
        )



business_service = BusinessService(crud_business)
