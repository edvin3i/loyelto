# from app.services.base import BaseService
# from app.crud.base import CRUDBase
# from app.models.wallet import Wallet
# from app.schemas.wallet import WalletCreate, WalletUpdate
#
# crud_wallet = CRUDBase[Wallet, WalletCreate, WalletUpdate](Wallet)
#
# class WalletService(BaseService[Wallet, WalletCreate, WalletUpdate]):
#     pass
#
# wallet_service = WalletService(crud_wallet)