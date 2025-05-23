import pytest
from sqlalchemy import select
from app.models import Business, Token


@pytest.mark.anyio
async def test_create_token_with_business(async_session):
    biz = Business(name="Bondar Coffee",
                   slug="bondar-coffee",
                   logo_url="https://example.com/logo.png",
                   owner_email="owner@iBondar.pro",
                   description="Best coffee in town",
                   country="France",
                   city="Paris",
                   address="1 Rue de Café",
                   zip_code="75000",
    )
    async_session.add(biz)
    await async_session.commit()

    token = Token(
        mint="MINT_CFE_001",
        symbol="BNDCFEE",
        decimals=2,
        business_id=biz.id,
        min_rate=0.01,
        max_rate=0.05,
    )
    async_session.add(token)
    await async_session.commit()

    # test token
    result = await async_session.execute(
        select(Token).where(Token.mint == "MINT_CFE_001")
    )
    token_from_db = result.scalar_one()
    assert token_from_db.symbol == "BNDCFEE"
    assert token_from_db.min_rate == 0.01
    assert token_from_db.business.name == "Bondar Coffee"


@pytest.mark.anyio
async def test_token_settlement_flag(async_session):
    loyl_token = Token(
        mint="LOYL_MINT_001",
        symbol="LOYL",
        settlement_token=True,
        decimals=6,
        min_rate=None,
        max_rate=None,
    )
    async_session.add(loyl_token)
    await async_session.commit()

    result = await async_session.execute(
        select(Token).where(Token.settlement_token.is_(True))
    )
    token_from_db = result.scalar_one()
    assert token_from_db.symbol == "LOYL"
    assert token_from_db.settlement_token is True
