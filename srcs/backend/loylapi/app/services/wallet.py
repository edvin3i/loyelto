from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.wallet import Wallet
from app.schemas.wallet import WalletCreate, WalletUpdate
from app.services.base import BaseService

crud_wallet = CRUDBase[Wallet, WalletCreate, WalletUpdate](Wallet)


class WalletService(BaseService[Wallet, WalletCreate, WalletUpdate]):
    async def add_if_missing(self, db: AsyncSession, user, pubkey: str) -> Wallet:
        # 1) try to find
        q = select(Wallet).where(Wallet.user_id == user.id, Wallet.pubkey == pubkey)
        res = await db.execute(q)
        wallet = res.scalar_one_or_none()
        if wallet:
            return wallet
        # 2) else create
        payload = WalletCreate(user_id=user.id, pubkey=pubkey)
        return await self.create(db, payload)

    async def get_by_pubkey(self, db: AsyncSession, pubkey: str) -> Wallet | None:
        """Get wallet by public key"""
        q = select(Wallet).where(Wallet.pubkey == pubkey)
        res = await db.execute(q)
        return res.scalar_one_or_none()


wallet_service = WalletService(crud_wallet)
