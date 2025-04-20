from __future__ import annotations
import uuid
import datetime
from app.utils import uuid_pk
from app.db.base import Base
from sqlalchemy.sql import func
from sqlalchemy import (
    String,
    DateTime,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = uuid_pk()
    privy_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True)
    phone: Mapped[str] = mapped_column(String(32), unique=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        # default=datetime.datetime.now(datetime.UTC)
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    wallets: Mapped[list["Wallet"]] = relationship(
        back_populates="user", lazy="selectin"
    )
