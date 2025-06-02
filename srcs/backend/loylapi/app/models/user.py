from __future__ import annotations
import uuid
import datetime
from typing import TYPE_CHECKING
from app.utils import uuid_pk
from app.db.base import Base
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import CITEXT
from sqlalchemy import (
    CheckConstraint,
    String,
    DateTime,
    Index,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

if TYPE_CHECKING:
    from app.models import Wallet
    from app.models import BusinessReview

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("(email IS NOT NULL OR phone IS NOT NULL)",
                        name="ck_users_contact_present"),
        CheckConstraint("email <> ''", name="ck_users_email_not_empty"),
        CheckConstraint("phone <> ''", name="ck_users_phone_not_empty"),

    )

    id: Mapped[uuid.UUID] = uuid_pk()
    privy_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    email: Mapped[str | None] = mapped_column(CITEXT(), unique=True, nullable=True, index=True)
    phone: Mapped[str | None] = mapped_column(String(32), unique=True, nullable=True, index=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        # default=datetime.datetime.now(datetime.UTC)
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    wallets: Mapped[list["Wallet"]] = relationship(
        back_populates="user", lazy="selectin"
    )

    reviews: Mapped[list[BusinessReview]] = relationship(
        "BusinessReview",
        back_populates="user",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
