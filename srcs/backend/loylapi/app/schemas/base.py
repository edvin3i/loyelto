from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class BaseSchema(BaseModel):
    class Config:
        orm_mode = True


class BaseDBSchema(BaseSchema):
    id: UUID
    created_at: datetime
    updated_at: datetime
