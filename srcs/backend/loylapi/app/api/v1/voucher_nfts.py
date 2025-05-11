from app.api.crud_router import create_crud_router
from app.services.voucher_nft import voucher_nft_service
from app.schemas.voucher import VoucherNFTCreate, VoucherNFTUpdate, VoucherNFTOut

router = create_crud_router(
    crud=voucher_nft_service.crud,
    create_schema=VoucherNFTCreate,
    update_schema=VoucherNFTUpdate,
    out_schema=VoucherNFTOut,
    prefix="/voucher_nfts",
    tags=["voucher_nfts"],
)
