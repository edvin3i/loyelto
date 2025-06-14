from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from app.db.session import get_db
from app.services.admin import admin_service
from app.schemas.admin import AdminTOTPSetup, AdminTOTPVerify
from app.models import Admin

router = APIRouter(prefix="/admin-api", tags=["admin"])


async def get_current_admin(request: Request,
                            db: AsyncSession = Depends(get_db)) -> Admin:
    """Getting admin from session"""
    admin_id = request.session.get("admin_id")
    if not admin_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    admin = await db.get(Admin, admin_id)
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found or inactive"
        )

    return admin


@router.post("/totp/setup", response_model=AdminTOTPSetup)
async def setup_totp(
        db: AsyncSession = Depends(get_db),
        current_admin: Admin = Depends(get_current_admin)
):
    """TOTP setup begin - give QR code"""
    if current_admin.is_totp_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP already enabled"
        )

    result = await admin_service.setup_totp(db, current_admin)
    return AdminTOTPSetup(**result)


@router.post("/totp/enable")
async def enable_totp(
        data: AdminTOTPVerify,
        db: AsyncSession = Depends(get_db),
        current_admin: Admin = Depends(get_current_admin)
):
    """Enabling TOTP after code checking"""
    success = await admin_service.enable_totp(db, current_admin, data.code)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TOTP code"
        )

    return {"message": "TOTP enabled successfully"}


@router.post("/totp/disable")
async def disable_totp(
        password: str,
        db: AsyncSession = Depends(get_db),
        current_admin: Admin = Depends(get_current_admin)
):
    """Disabling TOTP (password required)"""
    if not current_admin.is_totp_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP not enabled"
        )

    success = await admin_service.disable_totp(db, current_admin, password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )

    return {"message": "TOTP disabled successfully"}