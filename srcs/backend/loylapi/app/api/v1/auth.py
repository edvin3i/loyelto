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
privy = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)

auth_scheme = HTTPBearer(auto_error=False)
privy_rest = PrivyClient(settings.PRIVY_APP_ID, settings.PRIVY_API_KEY)


@router.post("/handshake", status_code=204, dependencies=[])
async def privy_handshake(
    creds: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    1) Checking access-token.
    2) If user is absent — creating and minting embedded-wallet.
    """
    logger.info("🔄 [HANDSHAKE] Starting Privy handshake")
    
    try:
        # Step 1: Check credentials
        if not creds:
            logger.warning("🚫 [HANDSHAKE] No credentials provided")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        logger.info(f"🔑 [HANDSHAKE] Verifying token: {creds.credentials[:20]}...")
        
        # Step 2: Verify Privy token
        try:
            claims = verify_privy_token(creds.credentials)
            logger.info(f"✅ [HANDSHAKE] Token verified for user: {claims.did}")
        except Exception as e:
            logger.error(f"❌ [HANDSHAKE] Token verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Privy token: {str(e)}"
            )

        # Step 3: Create or get user
        try:
            logger.info(f"👤 [HANDSHAKE] Creating/getting user for privy_id: {claims.did}")
            user = await user_service.create_or_get(
                db,
                privy_id=claims.did,
                email="",  # maybe webhook (BUT WEBHOOK IN PRO SUBSCRIPTION)
                phone="",
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
            if not user.wallets:
                logger.info(f"💰 [HANDSHAKE] Creating wallet for user: {user.id}")
                address = await privy_rest.create_wallets(claims.did)
                logger.info(f"🔑 [HANDSHAKE] Wallet created with address: {address}")
                
                await wallet_service.add_if_missing(db, user, address)
                logger.info(f"✅ [HANDSHAKE] Wallet added to user: {user.id}")
            else:
                logger.info(f"✅ [HANDSHAKE] User already has {len(user.wallets)} wallet(s)")
        except Exception as e:
            logger.error(f"❌ [HANDSHAKE] Wallet creation/addition failed: {e}")
            # Don't fail the handshake for wallet issues in development
            logger.warning(f"⚠️ [HANDSHAKE] Continuing without wallet (development mode)")

        logger.info("✅ [HANDSHAKE] Handshake completed successfully")
        return  # 204

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Catch all other exceptions and return 500
        logger.error(f"💥 [HANDSHAKE] Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


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
    if not verify_sig(sig, body, settings.PRIVY_API_SECRET):
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
