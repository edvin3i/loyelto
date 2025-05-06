from __future__ import annotations
import uuid
import datetime
from app.db.base import Base
from app.utils import uuid_pk

# from app.models import User
from sqlalchemy.sql import func
from sqlalchemy import (
    ForeignKey,
    UniqueConstraint,
    String,
    DateTime,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)


class Wallet(Base):
    __tablename__ = "wallets"
    __table_args__ = (UniqueConstraint("user_id", "pubkey", name="uq_user_pubkey"),)
    id: Mapped[uuid.UUID] = uuid_pk()
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    pubkey: Mapped[str] = mapped_column(String(44), unique=True, index=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        # default=datetime.datetime.now(datetime.UTC)
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    user: Mapped["User"] = relationship(back_populates="wallets", lazy="noload")
