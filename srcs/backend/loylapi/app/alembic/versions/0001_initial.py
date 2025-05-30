"""Initial combined schema

Revision ID: 0001_initial
Revises:
Create Date: 2025-05-13 12:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- ENUMS ---
    task_status = postgresql.ENUM("PENDING", "SUCCESS", "FAILED", "RETRY", name="task_status_enum")
    tx_type     = postgresql.ENUM("EARN", "REDEEM", "SWAP_IN", "SWAP_OUT", name="tx_type_enum")
    tx_status   = postgresql.ENUM("PENDING", "SUCCESS", "FAILED", name="tx_status_enum")
    voucher_st  = postgresql.ENUM("ACTIVE", "REDEEMED", "EXPIRED", name="voucher_status_enum")
    promo_type  = postgresql.ENUM("DISCOUNT", name="promo_type_enum")

    for enum in (task_status, tx_type, tx_status, voucher_st, promo_type):
        enum.create(op.get_bind(), checkfirst=True)

    # --- businesses ---
    op.create_table(
        "businesses",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("name", sa.String(128), nullable=False, unique=True),
        sa.Column("slug", sa.String(64), nullable=False),
        sa.Column("logo_url", sa.String(512), nullable=True),
        sa.Column("owner_email", sa.String(320), nullable=False),
        sa.Column("description", sa.String(512), nullable=False),
        sa.Column("country", sa.String(64), nullable=False),
        sa.Column("city", sa.String(128), nullable=False),
        sa.Column("address", sa.String(128), nullable=False),
        sa.Column("zip_code", sa.String(12), nullable=False),
        sa.Column("owner_privkey", sa.String(88), nullable=False),
        sa.Column("rate_loyl", sa.Numeric(18, 6), nullable=False, comment="Rate branded token to LOYL"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("length(slug) >= 3", name="check_slug_min_length"),
    )
    op.create_index("ix_businesses_slug", "businesses", ["slug"], unique=True)
    op.create_index("ix_businesses_owner_email", "businesses", ["owner_email"], unique=False)

    # --- celery_task_logs ---
    op.create_table(
        "celery_task_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("task_id", sa.String(50), nullable=False, unique=True),
        sa.Column("queue", sa.String(32), nullable=False),
        sa.Column("status", postgresql.ENUM(name="task_status_enum", create_type=False), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=True),
        sa.Column("result", sa.String(32), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_celery_task_logs_queue", "celery_task_logs", ["queue"], unique=False)
    op.create_index("ix_celery_task_logs_status", "celery_task_logs", ["status"], unique=False)

    # --- users ---
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("privy_id", sa.String(64), nullable=False, unique=True),
        sa.Column("email", sa.String(320), nullable=True, unique=True),
        sa.Column("phone", sa.String(32), nullable=True, unique=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_users_privy_id", "users", ["privy_id"], unique=True)

    # --- tokens ---
    op.create_table(
        "tokens",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("mint", sa.String(64), nullable=False, unique=True),
        sa.Column("symbol", sa.String(6), nullable=False, unique=True),
        sa.Column("coin_logo_url", sa.String(512), nullable=True),
        sa.Column("decimals", sa.Integer(), nullable=False),
        sa.Column("business_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("settlement_token", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("rate_loyl", sa.Numeric(18, 6), nullable=False),
        sa.Column("min_rate", sa.Numeric(18, 6), nullable=True),
        sa.Column("max_rate", sa.Numeric(18, 6), nullable=True),
        sa.Column("total_supply", sa.BigInteger(), nullable=False, comment="Current totalSupply (base-units)"),
        sa.CheckConstraint("decimals BETWEEN 0 AND 9", name="check_decimals_range"),
        sa.CheckConstraint("min_rate <= max_rate", name="check_min_le_max_rate"),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_tokens_mint", "tokens", ["mint"], unique=True)
    # NOTE: partial index on settlement_token only supported in Postgres
    op.create_index("uq_single_loyl", "tokens", ["settlement_token"], unique=True, postgresql_where=sa.text("settlement_token IS TRUE"))

    # --- voucher_templates ---
    op.create_table(
        "voucher_templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("business_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("description", sa.String(320), nullable=True),
        sa.Column("image_url", sa.String(320), nullable=True),
        sa.Column("price_points", sa.BigInteger(), nullable=False),
        sa.Column("supply", sa.Integer(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("collection_mint", sa.String(64), nullable=True, unique=True),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="CASCADE"),
    )

    # --- wallets ---
    op.create_table(
        "wallets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("pubkey", sa.String(44), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("user_id", "pubkey", name="uq_user_pubkey"),
    )
    op.create_index("ix_wallets_pubkey", "wallets", ["pubkey"], unique=True)

    # --- balances ---
    op.create_table(
        "balances",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("wallet_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("amount", sa.BigInteger(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["wallet_id"], ["wallets.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["token_id"], ["tokens.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("wallet_id", "token_id", name="uq_wallet_token"),
    )

    # --- point_txs ---
    op.create_table(
        "point_txs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("wallet_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("token_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tx_type", postgresql.ENUM(name="tx_type_enum", create_type=False), nullable=False),
        sa.Column("amount", sa.BigInteger(), nullable=False),
        sa.Column("fee_bps", sa.Integer(), nullable=True),
        sa.Column("sol_sig", sa.String(128), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("fee_bps BETWEEN 0 AND 10000", name="check_fee_bps_range"),
        sa.ForeignKeyConstraint(["wallet_id"], ["wallets.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["token_id"], ["tokens.id"]),
    )
    op.create_index("ix_point_txs_wallet_id", "point_txs", ["wallet_id"], unique=False)

    # --- swap_txs ---
    op.create_table(
        "swap_txs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("from_token_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("to_token_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("from_amount", sa.BigInteger(), nullable=False),
        sa.Column("to_amount", sa.BigInteger(), nullable=False),
        sa.Column("fee_bps", sa.Integer(), nullable=False),
        sa.Column("sol_sig", sa.String(128), nullable=True),
        sa.Column("sol_sig_redeem", sa.String(128), nullable=True),
        sa.Column("status", postgresql.ENUM(name="tx_status_enum", create_type=False), nullable=False, server_default="PENDING"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("from_amount > 0 AND to_amount > 0", name="check_swap_amounts_positive"),
        sa.ForeignKeyConstraint(["from_token_id"], ["tokens.id"]),
        sa.ForeignKeyConstraint(["to_token_id"], ["tokens.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
    )
    op.create_index("ix_swap_txs_user_id", "swap_txs", ["user_id"], unique=False)

    # --- voucher_nfts ---
    op.create_table(
        "voucher_nfts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("template_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("asset_id", sa.String(128), nullable=False),
        sa.Column("status", postgresql.ENUM(name="voucher_status_enum", create_type=False), nullable=False),
        sa.Column("redeemed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["template_id"], ["voucher_templates.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.UniqueConstraint("template_id", "asset_id", name="uq_template_asset"),
    )

    # --- promotion_campaigns ---
    op.create_table(
        "promotion_campaigns",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("business_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("promo_type", postgresql.ENUM(name="promo_type_enum", create_type=False), nullable=False),
        sa.Column("price_points", sa.BigInteger(), nullable=False),
        sa.Column("discount_pct", sa.Numeric(5, 2), nullable=False),
        sa.Column("active_from", sa.DateTime(timezone=True), nullable=True),
        sa.Column("active_to", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("business_id", "name", name="uq_campaign_name_biz"),
        sa.CheckConstraint("price_points > 0", name="check_positive_price"),
        sa.CheckConstraint("discount_pct BETWEEN 1 AND 100", name="check_pct_range"),
    )

    # --- token_pools ---
    op.create_table(
        "token_pools",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("token_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("provider", sa.String(16), nullable=False, server_default="platform"),
        sa.Column("init_tx", sa.String(88), nullable=False),
        sa.Column("balance_token", sa.BigInteger(), nullable=False),
        sa.Column("balance_loyl", sa.BigInteger(), nullable=False),
        sa.CheckConstraint("balance_token >= 0 AND balance_loyl >= 0", name="check_pool_nonnegative"),
        sa.UniqueConstraint("token_id", name="uq_token_pool"),
        sa.ForeignKeyConstraint(["token_id"], ["tokens.id"], ondelete="CASCADE"),
    )

    # --- voucher_mint_txs ---
    op.create_table(
        "voucher_mint_txs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("template_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("asset_id", sa.String(128), nullable=True),
        sa.Column("status", postgresql.ENUM(name="tx_status_enum", create_type=False), nullable=False),
        sa.ForeignKeyConstraint(["template_id"], ["voucher_templates.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    # drop tables in reverse order
    op.drop_table("voucher_mint_txs")
    op.drop_table("token_pools")
    op.drop_table("promotion_campaigns")
    op.drop_table("voucher_nfts")
    op.drop_table("swap_txs")
    op.drop_table("point_txs")
    op.drop_table("balances")
    op.drop_table("wallets")
    op.drop_table("voucher_templates")
    op.drop_table("tokens")
    op.drop_table("users")
    op.drop_table("celery_task_logs")
    op.drop_table("businesses")

    # drop enums
    for enum in [
        "promo_type_enum",
        "voucher_status_enum",
        "tx_status_enum",
        "tx_type_enum",
        "task_status_enum",
    ]:
        op.execute(f"DROP TYPE IF EXISTS {enum}")
