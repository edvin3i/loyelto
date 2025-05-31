import logging
from fastapi import APIRouter, Depends, Request, HTTPException, status
from starlette.responses import RedirectResponse
from app.core.settings import settings
from app.services.privy_client import PrivyClient, verify_sig
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.user import user_service
from app.services.wallet import wallet_service
from app.core.security import verify_privy_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])
privy_rest = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)

# FastAPI security scheme (no auto‑error so we can 401 manually)
auth_scheme = HTTPBearer(auto_error=False)


@router.post("/handshake", status_code=204, dependencies=[])
async def privy_handshake(
    creds: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: AsyncSession = Depends(get_db),
):
    """Single round‑trip login:
    1. Validate *id_token* (JWT) locally
    2. Fetch profile via Privy *GET /users/me*  – works on free tier
    3. Upsert user; back‑fill e‑mail / phone if newly available
    4. Ensure embedded Solana wallet exists (create if absent)
    """

    logger.info("🔄 [HANDSHAKE] Starting Privy handshake")

    # --- 1) Credential presence check --------------------------------------
    if not creds:
        logger.warning("🚫 [HANDSHAKE] Missing Authorization header")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    id_token = creds.credentials

    # --- 2) Verify JWT signature & claims ----------------------------------
    try:
        claims = verify_privy_token(id_token)  # -> did, sid
    except Exception as e:  # noqa: BLE001
        logger.error("❌ [HANDSHAKE] Token verification failed: %s", e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    logger.info("✅ [HANDSHAKE] Token OK for did=%s", claims.did)

    # --- 3) Pull profile (email / phone) – free‑tier compatible ------------
    try:
        profile = await privy_rest.get_user_by_token(id_token)
    except Exception as e:  # noqa: BLE001
        logger.error("❌ [HANDSHAKE] Failed to fetch /users/me: %s", e)
        raise HTTPException(status_code=502, detail="Privy API unavailable")

    # --- 4) Upsert user -----------------------------------------------------
    user = await user_service.create_or_get(
        db,
        privy_id=claims.did,
        email=profile.email,
        phone=profile.phone,
    )
    logger.info("👤 [HANDSHAKE] User ready: %s", user.id)

    # --- 5) Wallet guarantee ------------------------------------------------
    try:
        # Prefer embedded wallet if already present
        wallet_addr = profile.embedded_wallet
        if wallet_addr:
            await wallet_service.add_if_missing(db, user, wallet_addr)
        else:
            # No wallet yet – create one via Privy REST (still free)
            wallet_addr = await privy_rest.create_wallets(claims.did)
            await wallet_service.add_if_missing(db, user, wallet_addr)
        logger.info("💰 [HANDSHAKE] Wallet ensured: %s", wallet_addr)
    except Exception as e:  # noqa: BLE001
        logger.error("⚠️ [HANDSHAKE] Wallet ensure failed: %s – continuing", e)

    logger.info("✅ [HANDSHAKE] Completed for did=%s", claims.did)
    return  # 204 No Content


# --- callback & webhook unchanged (kept for Pro tier) ----------------------
@router.get("/callback")
async def privy_callback(code: str, db: AsyncSession = Depends(get_db)):
    privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)
    privy_id = await privy.exchange_code(code)
    p_user = await privy.get_user(privy_id)
    user = await user_service.create_or_get(db, privy_id=p_user.id, email=p_user.email, phone=p_user.phone)
    await wallet_service.add_if_missing(db, user, p_user.embedded_wallet)
    return RedirectResponse(url="/")


@router.post("/webhook")
async def privy_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    sig = request.headers.get("privy-signature")
    body = await request.body()
    if not verify_sig(sig, body, settings.PRIVY_API_SECRET):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    event = await request.json()
    if event["type"] == "user.updated":
        privy_id = event["data"]["id"]
        email = event["data"].get("email")
        phone = event["data"].get("phone")
        user = await user_service.get_by_privy(db, privy_id)
        if user:
            await user_service.update(db, user, UserUpdate(email=email, phone=phone))  # type: ignore[arg-type]
    return {"ok": True}
