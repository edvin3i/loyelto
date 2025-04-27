from __future__ import annotations
import uuid, datetime
from app.db.base import Base
from app.models import Wallet
from app.utils import uuid_pk
from decimal import Decimal
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, UniqueConstraint, DateTime, Numeric


class Balance(Base):
    __tablename__ = "balances"
    __table_args__ = (
        UniqueConstraint("wallet_id", "token_id", name="uq_wallet_token"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    wallet_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("wallets.id", ondelete="CASCADE"),  # maybe need to add index
    )
    token_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE"),  # maybe need to add index
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(38, 0), nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    wallet: Mapped["Wallet"] = relationship(lazy="noload")
    token: Mapped["Token"] = relationship(lazy="noload")
