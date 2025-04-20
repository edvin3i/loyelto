from __future__ import annotations
import uuid, enum, datetime
from app.db.base import Base
from app.utils import uuid_pk
from sqlalchemy import String, JSON, Enum as PgEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    RETRY = "retry"


class CeleryTaskLog(Base):
    __tablename__ = "celery_task_logs"

    id: Mapped[uuid.UUID] = uuid_pk()
    task_id: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    queue: Mapped[str] = mapped_column(String(32))
    status: Mapped[TaskStatus] = mapped_column(
        PgEnum(TaskStatus, name="task_status_enum")
    )
    payload: Mapped[dict | None] = mapped_column(JSON)
    result: Mapped[str | None] = mapped_column(String(32))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
