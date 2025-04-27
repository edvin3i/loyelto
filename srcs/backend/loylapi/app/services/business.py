from app.crud.base import CRUDBase
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate
from app.services.base import BaseService

crud_business = CRUDBase[Business, BusinessCreate, BusinessUpdate](Business)

class BusinessService(BaseService[Business, BusinessCreate, BusinessUpdate]):
    pass

business_service = BusinessService(crud_business)