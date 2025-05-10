from fastapi import APIRouter, Depends, Request, HTTPException, status
from starlette.responses import RedirectResponse
from app.core.settings import settings
from app.services.privy_client import PrivyClient, verify_sig
from app.services.wallet import wallet_service
from app.services.user import user_service
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["auth"])
privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)


@router.get("/callback")
async def privy_callback(code: str, db: AsyncSession = Depends(get_db)):
    """
    Get privy_id by code, creating user and hidden-wallet.
    """
    # exchange code → privy_id
    privy_id = await privy.exchange_code(code)  # needs method later
    p_user = await privy.get_user(privy_id)

    user = await user_service.create_or_get(
        db,
        privy_id=p_user.id,
        email="",  # Privy e-mail will come later as web-hook
        phone="",
    )
    # creating Wallet (ATA = embedded_wallet)
    await wallet_service.add_if_missing(db, user, p_user.embedded_wallet)

    return RedirectResponse(url="/")  # frontend gets session cookkie


@router.post("/webhook")
async def privy_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Listening events on 'user.updated', update e-mail / phone.
    """
    sig = request.headers.get("privy-signature")
    body = await request.body()
    if not verify_sig(sig, body, settings.PRIVY_SECRET):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    event = await request.json()
    if event["type"] == "user.updated":
        privy_id = event["data"]["id"]
        email = event["data"]["email"]
        phone = event["data"]["phone"]
        user = await user_service.get_by_privy(db, privy_id)
        if user:
            await user_service.update(db, user, {"email": email, "phone": phone})
    return {"ok": True}
