import uuid
import datetime
from app.db.base import Base
from app.utils import uuid_pk
from __future__ import annotations
from sqlalchemy import (
    String,
    DateTime,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)
from sqlalchemy.sql import func


class Business(Base):
    __tablename__ = "businesses"
    id: Mapped[uuid.UUID] = uuid_pk()
    name: Mapped[str] = mapped_column(String(128), unique=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True)
    logo_url: Mapped[str | None] = mapped_column(String(512))
    owner_email: Mapped[str] = mapped_column(String(320))
    created_at: Mapped[datetime.datetime] = mapped_column(
        # default=datetime.datetime.now(datetime.UTC)
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    loyalty_token: Mapped["Token"] = relationship(
        back_populates="business",
        uselist=False,
        lazy="joined",
    )
