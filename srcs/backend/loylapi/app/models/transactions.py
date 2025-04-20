from __future__ import annotations
import uuid, enum, datetime
from app.db.base import Base
from app.utils import uuid_pk
from sqlalchemy import (
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

class PointTx(Base):
    __tablename__ = "point_txs"

    id: Mapped[uuid.UUID] = uuid_pk()
    wallet_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("wallets.id", ondelete="SET NULL"),
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

    wallet: Mapped["Wallet"] = relationship(lazy="noload")
    wallet: Mapped["Token"] = relationship(lazy="noload")

class SwapTx(Base):
    __tablename__ = "swap_txs"

    id: Mapped[uuid.UUID] = uuid_pk()
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
    )
    from_token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tokens.id"))
    to_token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tokens.id"))
    from_amount: Mapped[int] = mapped_column(BigInteger)
    to_amount: Mapped[int] = mapped_column(BigInteger)
    fee_bps: Mapped[int]
    sol_sig: Mapped[str | None] = mapped_column(String(128))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(lazy="noload")