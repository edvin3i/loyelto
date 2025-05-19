from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.business import business_service
from app.schemas.business import BusinessCreate, BusinessOut
from app.api.deps import get_db
from app.tasks.business import mint_token_task


router = APIRouter(prefix="/business-onboarding", tags=["business-onboarding"])


@router.post("/", response_model=BusinessOut)
async def onboard_business(
    payload: BusinessCreate, 
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Onboard a new business:
    1. Create the business record
    2. Generate Solana keypair
    3. Trigger token minting and pool initialization
    
    The token minting process happens asynchronously via Celery.
    """
    # Create the business with its keypair
    business = await business_service.create(db, payload)
    
    # Enqueue the token minting task (this already happens in business_service.create,
    # but for explicitness, we'll add it here too)
    # mint_token_task.delay(str(business.id))
    
    return business
