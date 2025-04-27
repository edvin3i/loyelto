from app.crud.base import CRUDBase
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate

crud_business = CRUDBase[Business, BusinessCreate, BusinessUpdate](Business)

class BusinessService:
    async def create(self, db, payload):
        # add here more logic in future
        return crud_business.create(db, payload)

business_service = BusinessService()