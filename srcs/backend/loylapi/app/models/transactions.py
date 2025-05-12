from __future__ import annotations
import uuid, enum, datetime
from app.db.base import Base
from app.models import Wallet, Token, User
from app.utils import uuid_pk
from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    BigInteger,
    String,
    Enum as PgEnum,
    DateTime,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)
from sqlalchemy.sql import func


class TxType(str, enum.Enum):
    EARN = "earn"
    REDEEM = "redeem"
    SWAP_IN = "swap_in"
    SWAP_OUT = "swap_out"

class TxStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class PointTx(Base):
    __tablename__ = "point_txs"
    __table_args__ = (CheckConstraint("fee_bps BETWEEN 0 AND 10000"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    wallet_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("wallets.id", ondelete="SET NULL"),
        index=True,
    )
    token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tokens.id"))
    tx_type: Mapped[TxType] = mapped_column(PgEnum(TxType, name="tx_type_enum"))
    amount: Mapped[int] = mapped_column(BigInteger)
    fee_bps: Mapped[int | None]
    sol_sig: Mapped[str | None] = mapped_column(String(128))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    wallet: Mapped["Wallet"] = relationship(lazy="noload", foreign_keys=[wallet_id])
    token: Mapped["Token"] = relationship(lazy="noload", foreign_keys=[token_id])


class SwapTx(Base):
    __tablename__ = "swap_txs"
    __table_args__ = (CheckConstraint("from_amount > 0 AND to_amount > 0"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )
    from_token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tokens.id"))
    to_token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tokens.id"))
    from_amount: Mapped[int] = mapped_column(BigInteger)
    to_amount: Mapped[int] = mapped_column(BigInteger)
    fee_bps: Mapped[int]
    sol_sig: Mapped[str | None] = mapped_column(String(128))
    sol_sig_redeem: Mapped[str | None] = mapped_column(String(128))
    status: Mapped[TxStatus] = mapped_column(PgEnum(TxStatus, name="tx_status_enum"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(lazy="noload")
