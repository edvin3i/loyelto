from fastapi import APIRouter, Depends, HTTPException, Path
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.models import Business, Token, TokenPool
from sqlalchemy import select
from pydantic import BaseModel, UUID4

router = APIRouter(prefix="/token-minting", tags=["token-minting"])


class TokenMintingStatusResponse(BaseModel):
    business_id: UUID4
    business_name: str
    token_created: bool
    token_symbol: str | None = None
    token_mint_address: str | None = None
    pool_initialized: bool = False
    pool_balance_token: int | None = None
    pool_balance_loyl: int | None = None


@router.get("/status/{business_id}", response_model=TokenMintingStatusResponse)
async def get_token_minting_status(
    business_id: Annotated[UUID4, Path(...)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Check the status of token minting for a specific business.
    Returns information about the token and pool creation status.
    """
    # Query the business
    business_query = await db.execute(
        select(Business).where(Business.id == business_id)
    )
    business = business_query.scalar_one_or_none()

    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    # Prepare the response
    response = TokenMintingStatusResponse(
        business_id=business.id, business_name=business.name, token_created=False
    )

    # Check if token was created
    if business.loyalty_token:
        token = business.loyalty_token
        response.token_created = True
        response.token_symbol = token.symbol
        response.token_mint_address = token.mint

        # Check if pool was initialized
        pool_query = await db.execute(
            select(TokenPool).where(TokenPool.token_id == token.id)
        )
        pool = pool_query.scalar_one_or_none()

        if pool:
            response.pool_initialized = True
            response.pool_balance_token = pool.balance_token
            response.pool_balance_loyl = pool.balance_loyl

    return response
