from __future__ import annotations
import uuid
from app.db.base import Base

# from app.models import Business
from app.utils import uuid_pk
from decimal import Decimal
from sqlalchemy import (
    CheckConstraint,
    BigInteger,
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
    __table_args__ = (
        CheckConstraint("min_rate <= max_rate", name="check_min_le_max_rate"),
        CheckConstraint("decimals BETWEEN 0 AND 9", name="check_decimals_range"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    mint: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    symbol: Mapped[str] = mapped_column(String(6), unique=True)
    coin_logo_url: Mapped[str | None] = mapped_column(String(512))
    decimals: Mapped[int] = mapped_column(Integer, default=2)
    business_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("businesses.id", ondelete="SET NULL")
    )
    settlement_token: Mapped[bool] = mapped_column(
        Boolean, default=False
    )  # flag for LOYL

    rate_loyl: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)

    # need to check later
    min_rate: Mapped[Decimal | None] = mapped_column(
        Numeric(18, 6),
    )
    max_rate: Mapped[Decimal | None] = mapped_column(
        Numeric(18, 6),
    )

    total_supply: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
        comment="Current totalSupply (base-units)",
    )

    business: Mapped["Business"] = relationship(
        back_populates="loyalty_token", lazy="selectin"
    )

    @property
    def base_units(self) -> int:
        return 10**self.decimals
