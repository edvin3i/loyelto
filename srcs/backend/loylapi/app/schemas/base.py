from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class BaseSchema(BaseModel):
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True,
    }

class BaseDBSchema(BaseSchema):
    id: UUID
    created_at: datetime
    updated_at: datetime
