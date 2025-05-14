from uuid import UUID
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel
from app.schemas.types import RatingInt
from app.schemas.base import BaseDBSchema, BaseSchema

class ReviewCreate(BaseSchema):
    business_id: UUID
    user_id: UUID
    score: RatingInt
    review_text: str

class ReviewOut(BaseDBSchema):
    business_id: UUID
    user_id: UUID
    score: Decimal
    review_text: str
    created_at: datetime
