from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.business import business_service
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessOut
from app.api.deps import get_db


router = APIRouter(prefix="/businesses", tags=["businesses"])


@router.post("/", response_model=BusinessOut)
async def create_business(
        payload: BusinessCreate,
        db: Annotated[AsyncSession, Depends(get_db)]):
    return await business_service.create(db, payload)