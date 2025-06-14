import pyotp
import qrcode
import io
import base64
from typing import Optional
from datetime import datetime, UTC
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from app.crud.base import CRUDBase
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminUpdate
from app.services.base import BaseService

# context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CRUD for admins
crud_admin = CRUDBase[Admin, AdminCreate, AdminUpdate](Admin)


class AdminService(BaseService[Admin, AdminCreate, AdminUpdate]):
    """Service for working with admin users"""

    async def create(self, db: AsyncSession, payload: AdminCreate) -> Admin:
        """Create new admin user"""
        # hashing password
        hashed_password = pwd_context.hash(payload.password)

        # creating admin
        admin = Admin(
            email=payload.email,
            password_hash=hashed_password,
            is_active=True
        )
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        return admin

    async def authenticate(
            self, db: AsyncSession, email: str, password: str
    ) -> Optional[Admin]:
        """Authentication by email and password"""
        # looking for admin
        stmt = select(Admin).where(Admin.email == email)
        result = await db.execute(stmt)
        admin = result.scalar_one_or_none()

        if not admin or not admin.is_active:
            return None

        # check the password
        if not pwd_context.verify(password, admin.password_hash):
            return None

        return admin

    async def verify_totp(self, admin: Admin, code: str) -> bool:
        """Checking the TOTP code"""
        if not admin.totp_secret or not admin.is_totp_enabled:
            return False

        totp = pyotp.TOTP(admin.totp_secret)
        # Checking with 'window' for 1 period (30 seconds before and after)
        return totp.verify(code, valid_window=1)

    async def setup_totp(self, db: AsyncSession, admin: Admin) -> dict:
        """Setup TOTP for admin"""
        # generate the code
        secret = pyotp.random_base32()

        # create the provisioning URI for QR code
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=admin.email,
            issuer_name="LOYL Admin Panel"
        )

        # generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        # converting to base64 for displaying
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        # save the secret (but not set before TOTP is checked)
        admin.totp_secret = secret
        await db.commit()

        return {
            "qr_uri": f"data:image/png;base64,{qr_base64}",
            "secret": secret
        }

    async def enable_totp(
            self, db: AsyncSession, admin: Admin, code: str
    ) -> bool:
        """Switch on TOTP after code checking"""
        if not admin.totp_secret:
            return False

        # checking the code
        if not await self.verify_totp(admin, code):
            return False

        # activating the TOTP
        admin.is_totp_enabled = True
        await db.commit()
        return True

    async def disable_totp(
            self, db: AsyncSession, admin: Admin, password: str
    ) -> bool:
        """Switch off TOTP (pass required)"""
        # check password
        if not pwd_context.verify(password, admin.password_hash):
            return False

        # switch off TOTP
        admin.is_totp_enabled = False
        admin.totp_secret = None
        await db.commit()
        return True

    async def update_last_login(
            self, db: AsyncSession, admin: Admin
    ) -> None:
        """Update time of last login"""
        admin.last_login = datetime.now(UTC)
        await db.commit()

    async def get_by_email(
            self, db: AsyncSession, email: str
    ) -> Optional[Admin]:
        """Get admin by email"""
        stmt = select(Admin).where(Admin.email == email)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


# export admin instance
admin_service = AdminService(crud_admin)