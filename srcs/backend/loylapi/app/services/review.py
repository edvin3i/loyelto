from uuid import UUID
from decimal import Decimal
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.crud.base import CRUDBase
from app.models import BusinessReview
from app.schemas.review import ReviewCreate
from app.services.base import BaseService


# crud object for BusinessReview: uses the same schema for create and update
crud_review = CRUDBase[BusinessReview, ReviewCreate, ReviewCreate](BusinessReview)


class ReviewService(BaseService[BusinessReview, ReviewCreate, ReviewCreate]):
    """
    Service layer for managing BusinessReview entities.
    """

    async def create(self, db: AsyncSession, payload: ReviewCreate) -> BusinessReview:
        """
        Create a new review for a business.

        Raises:
            ValueError: if payload data is invalid (e.g., foreign keys).
        """
        # Let BaseService/CRUD handle the insertion and commit.
        return await super().create(db, payload)

    async def get_reviews_for_business(
        self,
        db: AsyncSession,
        business_id: UUID,
        start: int = 0,
        limit: int = 10,
    ) -> List[BusinessReview]:
        """
        Fetch a paginated list of reviews for a given business,
        ordered by newest first.
        """
        stmt = (
            select(BusinessReview)
            .where(BusinessReview.business_id == business_id)
            .order_by(BusinessReview.created_at.desc())
            .offset(start)
            .limit(limit)
        )
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_average_rating(
        self,
        db: AsyncSession,
        business_id: UUID,
    ) -> Decimal:
        """
        Compute and return the average score for a business.
        Returns Decimal('0') if no reviews exist.
        """
        stmt = select(func.avg(BusinessReview.score)).where(
            BusinessReview.business_id == business_id
        )
        result = await db.execute(stmt)
        avg = result.scalar_one_or_none()
        return avg or Decimal("0.00")


# Export a singleton instance
review_service = ReviewService(crud_review)
