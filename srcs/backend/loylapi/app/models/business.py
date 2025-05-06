from __future__ import annotations
import uuid
import datetime


from app.db.base import Base

# from app.models import Token
from app.utils import uuid_pk
from sqlalchemy.sql import func
from sqlalchemy import (
    CheckConstraint,
    String,
    DateTime,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)


class Business(Base):
    __tablename__ = "businesses"
    __table_args__ = (
        CheckConstraint("length(slug) >= 3", name="check_slug_min_length"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    name: Mapped[str] = mapped_column(String(128), unique=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    logo_url: Mapped[str | None] = mapped_column(String(512))
    owner_email: Mapped[str] = mapped_column(String(320), index=True)
    description: Mapped[str] = mapped_column(String(512))
    country: Mapped[str] = mapped_column(String(64))
    city: Mapped[str] = mapped_column(String(128))
    address: Mapped[str] = mapped_column(String(128))
    zip_code: Mapped[str] = mapped_column(String(12))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    loyalty_token: Mapped["Token"] = relationship(
        back_populates="business",
        uselist=False,
        lazy="selectin",
    )
    voucher_templates: Mapped[list["VoucherTemplate"]] = relationship(
        back_populates="business",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
