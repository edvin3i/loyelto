from __future__ import annotations
import uuid
from app.db.base import Base

# from app.models import Business
from app.utils import uuid_pk
from decimal import Decimal
from sqlalchemy import (
    UniqueConstraint,
    ForeignKey,
    Boolean,
    Numeric,
    Integer,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)


class Token(Base):
    __tablename__ = "tokens"

    id: Mapped[uuid.UUID] = uuid_pk()
    mint: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    symbol: Mapped[str] = mapped_column(String(6), unique=True)
    decimals: Mapped[int] = mapped_column(Integer, default=2)
    business_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("businesses.id", ondelete="SET NULL")
    )
    settlement_token: Mapped[bool] = mapped_column(
        Boolean, default=False
    )  # flag for LOYL

    # need to check later
    min_rate: Mapped[Decimal | None] = mapped_column(Numeric(18, 6), nullable=True)
    max_rate: Mapped[Decimal | None] = mapped_column(Numeric(18, 6), nullable=True)

    business: Mapped["Business"] = relationship(
        back_populates="loyalty_token", lazy="selectin"
    )
