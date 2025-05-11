from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate
from app.services.base import BaseService

crud_business = CRUDBase[Business, BusinessCreate, BusinessUpdate](Business)


class BusinessService(BaseService[Business, BusinessCreate, BusinessUpdate]):
    async def create(self, db: AsyncSession, payload: BusinessCreate) -> Business:
        biz = await super().create(db, payload)
        # enqueue mint & pool bootstrap
        from app.tasks.business import mint_token_task
        mint_token_task.delay(str(biz.id))
        return biz


business_service = BusinessService(crud_business)
