from __future__ import annotations
import uuid
from app.db.base import Base
from app.models import Token

from app.utils import uuid_pk
from sqlalchemy import (
    CheckConstraint,
    UniqueConstraint,
    ForeignKey,
    String,
    BigInteger,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)


class TokenPool(Base):
    __tablename__ = "token_pools"
    __table_args__ = (
        UniqueConstraint("token_id", name="uq_token_pool"),
        CheckConstraint('balance_token >= 0 AND balance_loyl >= 0',
                        name='check_pool_nonnegative')
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    token_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tokens.id", ondelete="CASCADE")
    )
    provider: Mapped[str] = mapped_column(
        String(16),
        default="platform",
    )
    init_tx: Mapped[str] = mapped_column(
        String(88),  # len for Solana tx signature
        nullable=False,
        comment="Signature of the on-chain tx that initialized this pool"
    )

    balance_token: Mapped[int] = mapped_column(BigInteger)
    balance_loyl: Mapped[int] = mapped_column(BigInteger)

    token: Mapped["Token"] = relationship(lazy="noload")
