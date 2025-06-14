from fastapi import APIRouter, Depends, status, HTTPException
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.tasks.voucher import mint_voucher_task
from app.models import VoucherTemplate
from app.schemas.voucher import VoucherNFTOut

router = APIRouter(prefix="/voucher", tags=["vouchers"])


@router.post(
    "/template/{template_id}/mint",
    response_model=VoucherNFTOut,
    status_code=status.HTTP_202_ACCEPTED,
)
async def mint_voucher(
    template_id: UUID, user_id: UUID, db: AsyncSession = Depends(get_db)
):
    tmpl = await db.get(VoucherTemplate, template_id)
    if not tmpl:
        raise HTTPException(404, "template not found")
    mint_voucher_task.delay(str(template_id), str(user_id))
    return {"status": "queued"}
