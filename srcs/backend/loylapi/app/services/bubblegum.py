"""
Skeletal wrapper around Bubblegum mints – for MVP minting off-chain,
returning dummy asset_id (uuid4) and saving to db.
"""
import uuid
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import VoucherTemplate, VoucherNFT, VoucherStatus

class BubblegumMinter:
    async def mint(
        self, db: AsyncSession, template: VoucherTemplate, user_id: UUID
    ) -> VoucherNFT:
        asset_id = str(uuid.uuid4())  # in real life will be – hash from on-chain asset
        nft = VoucherNFT(
            template_id=template.id,
            user_id=user_id,
            asset_id=asset_id,
            status=VoucherStatus.ACTIVE,
            redeemed_at=None,
        )
        db.add(nft)
        await db.commit()
        await db.refresh(nft)
        return nft

bubblegum_minter = BubblegumMinter()
