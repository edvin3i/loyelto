from __future__ import annotations
import uuid, enum, datetime
from app.db.base import Base
from app.utils import uuid_pk
from sqlalchemy import (
    ForeignKey,
    BigInteger,
    String,
    Enum as PgEnum,
    DateTime
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)
from sqlalchemy.sql import func


class VoucherStatus(str, enum.Enum):
    ACTIVE = "active"
    REDEEMED = "redeemed"
    EXPIRED = "expired"

class VoucherTemplate(Base):
    __tablename__ = "voucher_templates"

    id: Mapped[uuid.UUID] = uuid_pk()
    business_id: Mapped[uuid.UUID] = ForeignKey("businesses.id", ondelete="CASCADE")
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str | None]
    image_url: Mapped[str | None]
    price_points: Mapped[int] = mapped_column(BigInteger)
    supply: Mapped[int]
    expires_at: Mapped[datetime.datetime | None]
    collection_mint: Mapped[str | None] = mapped_column(String(64))

    vouchers: Mapped[list["VoucherNFT"]] = relationship(
        back_populates="template", lazy="selectin"
    )
    business: Mapped["Business"] = relationship(lazy="noload")

class VoucherNFT(Base):
    id: Mapped[uuid.UUID] = uuid_pk()
    template_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("voucher_templates.id", ondelete="CASCADE"),
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
    )
    asset_id: Mapped[str] = mapped_column(String(128))
    status: Mapped[VoucherStatus] = mapped_column(
        PgEnum(VoucherStatus, name="voucher_status_enum"),
        default=VoucherStatus.ACTIVE,
    )
    redeemed_at: Mapped[datetime.datetime | None]
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    template: Mapped[VoucherTemplate] = relationship(
        back_populates="vouchers", lazy="selectin"
    )
    user: Mapped["User"] = relationship(lazy="noload")
