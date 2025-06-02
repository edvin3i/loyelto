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

@router.post("/handshake", status_code=204)
async def privy_handshake(
    creds: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: AsyncSession = Depends(get_db),
):

    """Single round‑trip login:
    1. Validate *id_token* (JWT) locally
    2. Fetch profile via Privy *GET /users/id*  – works on free tier
    3. Upsert user; back‑fill e‑mail / phone if newly available
    4. Ensure embedded Solana wallet exists (create if absent)
    """

    logger.info("🔄 [HANDSHAKE] Starting Privy handshake")

    try:
        # Step 1: Check credentials
        if not creds:
            logger.warning("🚫 [HANDSHAKE] No credentials provided")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        id_token = creds.credentials
        logger.info(f"🔑 [HANDSHAKE] Received id_token: {id_token[:20]}...")

        # Step 2: Fetch user data from Privy
        try:
            user_data = await PrivyClient.get_user_by_token(id_token)
            logger.info(f"✅ [HANDSHAKE] Retrieved user data for Privy ID: {user_data.id}")
        except Exception as e:
            logger.error(f"❌ [HANDSHAKE] Failed to retrieve user data: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid id_token: {str(e)}"
            )

        # Step 3: Create or get user
        try:
            logger.info(f"👤 [HANDSHAKE] Creating/getting user for privy_id: {user_data.id}")
            user = await user_service.create_or_get(
                db,
                privy_id=user_data.id,
                email=user_data.email,
                phone=user_data.phone,
            )
            logger.info(f"✅ [HANDSHAKE] User found/created: {user.id}")
        except Exception as e:
            logger.error(f"❌ [HANDSHAKE] User creation/retrieval failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"User service error: {str(e)}"
            )

        # Step 4: Handle wallet creation if needed
        try:
            if not user.wallets and user_data.embedded_wallet:
                logger.info(f"💰 [HANDSHAKE] Adding wallet for user: {user.id}")
                await wallet_service.add_if_missing(db, user, user_data.embedded_wallet)
                logger.info(f"✅ [HANDSHAKE] Wallet added to user: {user.id}")
            else:
                logger.info(f"✅ [HANDSHAKE] User already has {len(user.wallets)} wallet(s)")
        except Exception as e:
            logger.error(f"❌ [HANDSHAKE] Wallet addition failed: {e}")
            logger.warning(f"⚠️ [HANDSHAKE] Continuing without wallet (development mode)")

        logger.info("✅ [HANDSHAKE] Handshake completed successfully")
        return  # 204

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"💥 [HANDSHAKE] Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )



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