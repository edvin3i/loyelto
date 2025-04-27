from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.voucher import VoucherNFT
from app.schemas.voucher import VoucherNFTCreate, VoucherNFTUpdate

crud_voucher_nft = CRUDBase[VoucherNFT, VoucherNFTCreate, VoucherNFTUpdate](VoucherNFT)

class VoucherNFTService(BaseService[VoucherNFT, VoucherNFTCreate, VoucherNFTUpdate]):
    pass

voucher_nft_service = VoucherNFTService(crud_voucher_nft)