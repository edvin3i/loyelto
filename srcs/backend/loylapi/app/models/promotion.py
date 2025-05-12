from __future__ import annotations
import enum, uuid, datetime
from decimal import Decimal
from sqlalchemy import (
    String,
    BigInteger,
    Numeric,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
    Enum as PgEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.utils import uuid_pk


class PromotionType(str, enum.Enum):
    DISCOUNT = "discount"


class PromotionCampaign(Base):
    """
    Promotion campaign bound to a business loyalty token.
    """
    __tablename__ = "promotion_campaigns"
    __table_args__ = (
        UniqueConstraint("business_id", "name", name="uq_campaign_name_biz"),
        CheckConstraint("price_points > 0", name="check_positive_price"),
        CheckConstraint("discount_pct BETWEEN 1 AND 100", name="check_pct_range"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    business_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("businesses.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(128))
    promo_type: Mapped[PromotionType] = mapped_column(
        PgEnum(PromotionType, name="promo_type_enum")
    )
    price_points: Mapped[int] = mapped_column(BigInteger)
    discount_pct: Mapped[int] = mapped_column(
        Numeric(5, 2),
        comment="Percent discount applied to purchase amount",
    )
    active_from: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True))
    active_to: Mapped[datetime.datetime | None] = mapped_column(DateTime(timezone=True))

    business: Mapped["Business"] = relationship(lazy="noload")
