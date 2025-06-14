from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqladmin.authentication import AuthenticationBackend
from app.db.session import AsyncSessionLocal
from app.services.admin import admin_service
from app.core.settings import settings


class AdminAuthBackend(AuthenticationBackend):
    """Custom auth backend for authentication with SQLAdmin with TOTP support"""

    async def login(self, request: Request) -> bool:
        """Entering handling"""
        form = await request.form()
        email = form.get("username", "")
        password = form.get("password", "")
        totp_code = form.get("totp_code", "")

        async with AsyncSessionLocal() as db:
            # Authentication by email/password
            admin = await admin_service.authenticate(db, email, password)
            if not admin:
                return False

            # if TOTP is on, check the code
            if admin.is_totp_enabled:
                # if code unavailable, save temp data
                if not totp_code:
                    request.session.update(
                        {"temp_admin_id": str(admin.id), "needs_totp": True}
                    )
                    return False

                # checking TOTP code
                if not await admin_service.verify_totp(admin, totp_code):
                    return False

            # succesfull entering
            request.session.update(
                {
                    "admin_id": str(admin.id),
                    "admin_email": admin.email,
                    "needs_totp": False,
                }
            )
            request.session.pop("temp_admin_id", None)

            # update last_login
            await admin_service.update_last_login(db, admin)

        return True

    async def logout(self, request: Request) -> bool:
        """Exiting handling"""
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> RedirectResponse | None:
        """Check auth for every request"""
        admin_id = request.session.get("admin_id")

        # if is admin_id presented in session - user is authenticated
        if admin_id:
            return True

        # checking the TOTP requirement
        if request.session.get("needs_totp"):
            # grant acces to the TOTP page
            if str(request.url.path).endswith("/login"):
                return True

        # if not authenticted - redirect to login
        if not str(request.url.path).endswith("/login"):
            return RedirectResponse(url="/admin/login", status_code=302)

        return False


# create the backend instance
admin_auth_backend = AdminAuthBackend(secret_key=settings.ADMIN_SECRET_KEY)
