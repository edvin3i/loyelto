from sqladmin import Admin
from starlette.middleware.sessions import SessionMiddleware
from app.admin.auth import admin_auth_backend
from app.admin.views import (
    UserAdmin,
    BusinessAdmin,
    TokenAdmin,
    BalanceAdmin,
    PointTxAdmin,
    SwapTxAdmin,
    CeleryTaskLogAdmin,
    AdminAdmin,
    TokenPoolAdmin,
    VoucherTemplateAdmin,
    BusinessReviewAdmin,
)


def setup_admin(app, engine):
    """Setting admin panel"""

    # Add SessionMiddleware
    # (SQLAdmin requires it for authentication)
    middleware_classes = [m.cls for m in app.user_middleware]
    if SessionMiddleware not in middleware_classes:
        app.add_middleware(
            SessionMiddleware, secret_key=app.state.settings.ADMIN_SECRET_KEY
        )

    # create admin panel
    admin = Admin(
        app=app,
        engine=engine,
        title="LOYL Admin Panel",
        authentication_backend=admin_auth_backend,
        templates_dir="app/admin/templates",  # for custom dashboards
    )

    # registering views
    admin.add_view(UserAdmin)
    admin.add_view(BusinessAdmin)
    admin.add_view(TokenAdmin)
    admin.add_view(TokenPoolAdmin)
    admin.add_view(BalanceAdmin)
    admin.add_view(PointTxAdmin)
    admin.add_view(SwapTxAdmin)
    admin.add_view(VoucherTemplateAdmin)
    admin.add_view(BusinessReviewAdmin)
    admin.add_view(CeleryTaskLogAdmin)
    admin.add_view(AdminAdmin)

    return admin
