from sqladmin import ModelView
from starlette.requests import Request
from app.models import (
    User,
    Business,
    Token,
    Wallet,
    Balance,
    PointTx,
    SwapTx,
    VoucherTemplate,
    VoucherNFT,
    BusinessReview,
    PromotionCampaign,
    TokenPool,
    CeleryTaskLog,
    Admin,
)


class BaseAdminView(ModelView):
    """Base class for all views"""

    page_size = 50
    page_size_options = [25, 50, 100, 200]


class UserAdmin(BaseAdminView, model=User):
    column_list = [User.id, User.privy_id, User.email, User.phone, User.created_at]
    column_searchable_list = [User.email, User.phone, User.privy_id]
    column_sortable_list = [User.created_at]
    column_default_sort = [(User.created_at, True)]  # desc

    # read only
    can_create = False
    can_delete = False
    can_edit = False


class BusinessAdmin(BaseAdminView, model=Business):
    column_list = [
        Business.id,
        Business.name,
        Business.slug,
        Business.owner_email,
        Business.rate_loyl,
        Business.created_at,
    ]
    column_searchable_list = [Business.name, Business.slug, Business.owner_email]
    column_sortable_list = [Business.created_at, Business.rate_loyl]
    column_default_sort = [(Business.created_at, True)]



class TokenAdmin(BaseAdminView, model=Token):
    column_list = [
        Token.id,
        Token.symbol,
        Token.mint,
        Token.business_id,
        Token.rate_loyl,
        Token.total_supply,
        Token.decimals,
    ]
    column_searchable_list = [Token.symbol, Token.mint]
    column_sortable_list = [Token.rate_loyl, Token.total_supply]

    can_create = False  # tokens create automatically


class BalanceAdmin(BaseAdminView, model=Balance):
    column_list = [
        Balance.id,
        Balance.wallet_id,
        Balance.token_id,
        Balance.amount,
        Balance.updated_at,
    ]
    column_sortable_list = [Balance.amount, Balance.updated_at]
    column_default_sort = [(Balance.updated_at, True)]

    can_create = False
    can_edit = False


class PointTxAdmin(BaseAdminView, model=PointTx):
    column_list = [
        PointTx.id,
        PointTx.wallet_id,
        PointTx.token_id,
        PointTx.tx_type,
        PointTx.amount,
        PointTx.sol_sig,
        PointTx.created_at,
    ]
    column_searchable_list = [PointTx.sol_sig]
    column_sortable_list = [PointTx.created_at, PointTx.amount]
    column_default_sort = [(PointTx.created_at, True)]

    can_create = False
    can_edit = False
    can_delete = False


class SwapTxAdmin(BaseAdminView, model=SwapTx):
    column_list = [
        SwapTx.id,
        SwapTx.user_id,
        SwapTx.from_token_id,
        SwapTx.to_token_id,
        SwapTx.from_amount,
        SwapTx.to_amount,
        SwapTx.status,
        SwapTx.created_at,
    ]
    column_sortable_list = [SwapTx.created_at, SwapTx.status]
    column_default_sort = [(SwapTx.created_at, True)]

    can_create = False
    can_edit = False
    can_delete = False


class CeleryTaskLogAdmin(BaseAdminView, model=CeleryTaskLog):
    column_list = [
        CeleryTaskLog.id,
        CeleryTaskLog.task_id,
        CeleryTaskLog.queue,
        CeleryTaskLog.status,
        CeleryTaskLog.created_at,
    ]
    column_searchable_list = [CeleryTaskLog.task_id]
    column_sortable_list = [CeleryTaskLog.created_at, CeleryTaskLog.status]
    column_default_sort = [(CeleryTaskLog.created_at, True)]

    can_create = False
    can_delete = False


class AdminAdmin(BaseAdminView, model=Admin):
    """Admin view"""

    column_list = [
        Admin.id,
        Admin.email,
        Admin.is_totp_enabled,
        Admin.is_active,
        Admin.last_login,
        Admin.created_at,
    ]
    column_searchable_list = [Admin.email]
    column_sortable_list = [Admin.created_at, Admin.last_login]
    column_default_sort = [(Admin.created_at, True)]

    # hide sensitive fields
    # column_exclude_list = [Admin.password_hash, Admin.totp_secret]
    form_excluded_columns = [Admin.password_hash, Admin.totp_secret, Admin.last_login]

    # only superadmin can rule aother admins
    def is_accessible(self, request: Request) -> bool:
        # later needs superadmin checking
        return True

    def is_visible(self, request: Request) -> bool:
        # menu visibility
        return True


# other models views
class TokenPoolAdmin(BaseAdminView, model=TokenPool):
    column_list = [
        TokenPool.id,
        TokenPool.token_id,
        TokenPool.balance_token,
        TokenPool.balance_loyl,
        TokenPool.provider,
    ]
    can_create = False
    can_edit = False


class VoucherTemplateAdmin(BaseAdminView, model=VoucherTemplate):
    column_list = [
        VoucherTemplate.id,
        VoucherTemplate.business_id,
        VoucherTemplate.name,
        VoucherTemplate.price_points,
        VoucherTemplate.supply,
        VoucherTemplate.expires_at,
    ]
    column_searchable_list = [VoucherTemplate.name]


class BusinessReviewAdmin(BaseAdminView, model=BusinessReview):
    column_list = [
        BusinessReview.id,
        BusinessReview.business_id,
        BusinessReview.user_id,
        BusinessReview.score,
        BusinessReview.created_at,
    ]
    column_sortable_list = [BusinessReview.created_at, BusinessReview.score]
    column_default_sort = [(BusinessReview.created_at, True)]
