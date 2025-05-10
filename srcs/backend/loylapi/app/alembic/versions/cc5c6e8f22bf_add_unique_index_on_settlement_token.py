"""add unique index on settlement_token

Revision ID: cc5c6e8f22bf
Revises:
Create Date: 2025-05-10 22:58:34.775535

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "cc5c6e8f22bf"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_index(
        "uq_single_loyl",
        "tokens",
        ["settlement_token"],
        unique=True,
        postgresql_where=sa.text("settlement_token IS TRUE"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("uq_single_loyl", table_name="tokens")
