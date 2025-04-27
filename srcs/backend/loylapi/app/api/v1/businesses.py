from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.business import Business
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessOut
from app.api.deps import get_db


router = APIRouter(prefix="/businesses", tags=["businesses"])
