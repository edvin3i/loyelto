from __future__ import annotations
import uuid, datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List
from sqlalchemy.ext.hybrid import hybrid_property
from app.db.base import Base
# from app.models import VoucherTemplate, Token
from app.utils import uuid_pk
from sqlalchemy.sql import func
from sqlalchemy import (
    CheckConstraint,
    String,
    DateTime,
    Numeric,
    ForeignKey,
    select,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
    column_property,
)


if TYPE_CHECKING:
    from app.models.voucher import VoucherTemplate
    from app.models.token import Token

class BusinessReview(Base):
    __tablename__ = "business_reviews"
    __table_args__ = (
        CheckConstraint("score >= 1 AND score <= 5", name="check_score_range"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"))
    business: Mapped[Business] = relationship(
        "Business",
        back_populates="reviews",
        lazy="joined",
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    score: Mapped[Decimal] = mapped_column(
        Numeric(3, 2),
        nullable=False,
        comment="Score from 1.00 to 5.00",
    )
    review_text: Mapped[str] = mapped_column(String(512))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
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
    owner_pubkey:  Mapped[str] = mapped_column(String(44), nullable=False, unique=True, index=True)
    owner_privkey: Mapped[str] = mapped_column(String(88))
    description: Mapped[str] = mapped_column(String(512))
    country: Mapped[str] = mapped_column(String(64))
    city: Mapped[str] = mapped_column(String(128))
    address: Mapped[str] = mapped_column(String(128))
    zip_code: Mapped[str] = mapped_column(String(12))
    rate_loyl: Mapped[Decimal] = mapped_column(
        Numeric(18, 6),
        nullable=False,
        comment="Rate branded token to LOYL",
    )
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
        "Token",
        back_populates="business",
        uselist=False,
        lazy="selectin",
    )
    voucher_templates: Mapped[List["VoucherTemplate"]] = relationship(
        "VoucherTemplate",
        back_populates="business",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    reviews: Mapped[List["BusinessReview"]] = relationship(
        "BusinessReview",
        back_populates="business",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @hybrid_property
    def rating(self) -> float:
        if not hasattr(self, "reviews") or not self.reviews:
            return 0.0
        return float(sum([r.score for r in self.reviews]) / len(self.reviews))

    rating_db = column_property(
        select(func.avg(BusinessReview.score))
        .where(BusinessReview.business_id == id)
        .correlate_except(BusinessReview)
        .scalar_subquery()
    )


