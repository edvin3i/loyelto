from app.api.crud_router import create_crud_router
from app.services.voucher_template import voucher_template_service
from app.schemas.voucher import VoucherTemplateCreate, VoucherTemplateUpdate, VoucherTemplateOut

router = create_crud_router(
    crud=voucher_template_service.crud,
    create_schema=VoucherTemplateCreate,
    update_schema=VoucherTemplateUpdate,
    out_schema=VoucherTemplateOut,
    prefix="/voucher_templates",
    tags=["voucher_templates"],
)
