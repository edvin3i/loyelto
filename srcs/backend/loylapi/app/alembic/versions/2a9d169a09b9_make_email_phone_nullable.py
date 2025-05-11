"""make email/phone nullable

Revision ID: 2a9d169a09b9
Revises: 92b7fd27073d
Create Date: 2025-05-12 01:08:47.358178

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a9d169a09b9'
down_revision: Union[str, None] = '92b7fd27073d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
