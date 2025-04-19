import uuid
from sqlalchemy import UUID
from sqlalchemy.orm import mapped_column, Mapped


def uuid_pk() -> Mapped[uuid.UUID]:
    return mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
