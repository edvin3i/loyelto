# app/alembic/versions/0002_owner_pubkey.py
from alembic import op, context
import sqlalchemy as sa

# revision identifiers, etc.
revision = "0002_owner_pubkey"
down_revision = "0001_initial"
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1) add the new column (nullable=True so existing rows are OK)
    op.add_column(
        "businesses",
        sa.Column("owner_pubkey", sa.String(length=88), nullable=True),
    )

    # 2) immediately make it non-nullable in a batch context
    with op.batch_alter_table("businesses") as batch_op:
        batch_op.alter_column(
            "owner_pubkey",
            existing_type=sa.String(length=88),
            nullable=False,
        )

def downgrade() -> None:
    # reverse the same way
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "sqlite":
        with op.batch_alter_table("businesses", reflect=True) as batch_op:
            batch_op.alter_column(
                "owner_pubkey",
                existing_type=sa.String(length=88),
                nullable=True,
            )
    else:
        op.alter_column(
            "businesses",
            "owner_pubkey",
            existing_type=sa.String(length=88),
            nullable=True,
        )
