"""add promotion campaign

Revision ID: 56ea7b5ea08b
Revises: 2a9d169a09b9
Create Date: 2025-05-12 16:48:20.690959

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '56ea7b5ea08b'
down_revision: Union[str, None] = '2a9d169a09b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "promotion_campaigns",
        sa.Column("id", sa.UUID(), primary_key=True, nullable=False),
        sa.Column("business_id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column(
            "promo_type",
            sa.Enum("DISCOUNT", name="promo_type_enum"),
            nullable=False,
        ),
        sa.Column("price_points", sa.BigInteger(), nullable=False),
        sa.Column("discount_pct", sa.Numeric(5, 2), nullable=False),
        sa.Column("active_from", sa.DateTime(timezone=True), nullable=True),
        sa.Column("active_to", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["business_id"], ["businesses.id"],
                                ondelete="CASCADE"),
        sa.UniqueConstraint("business_id", "name", name="uq_campaign_name_biz"),
        sa.CheckConstraint("price_points > 0", name="check_positive_price"),
        sa.CheckConstraint("discount_pct BETWEEN 1 AND 100",
                           name="check_pct_range"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("promotion_campaigns")
    op.execute("DROP TYPE promo_type_enum")
