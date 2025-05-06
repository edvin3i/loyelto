from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.voucher import VoucherTemplate
from app.schemas.voucher import VoucherTemplateCreate, VoucherTemplateUpdate

crud_voucher_template = CRUDBase[VoucherTemplate, VoucherTemplateCreate, VoucherTemplateUpdate](VoucherTemplate)

class VoucherTemplateService(BaseService[VoucherTemplate, VoucherTemplateCreate, VoucherTemplateUpdate]):
    pass

voucher_template_service = VoucherTemplateService(crud_voucher_template)