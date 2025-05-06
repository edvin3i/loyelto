import pytest
from sqlalchemy import select
from app.models import Business, Token


@pytest.mark.anyio
async def test_create_business(async_session):
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

    result = await async_session.execute(
        select(Business).where(Business.slug == "bondar-coffee")
    )
    biz_from_db = result.scalar_one()

    assert biz_from_db.name == "Bondar Coffee"
    assert biz_from_db.owner_email == "owner@iBondar.pro"


@pytest.mark.anyio
async def test_business_unique_constraints(async_session):
    b1 = Business(
        name="Bondar Coffee",
        slug="bondar-coffee",
        logo_url="https://example.com/logo.png",
        owner_email="owner@iBondar.pro",
        description="Best coffee in town",
        country="France",
        city="Paris",
        address="1 Rue de Café",
        zip_code="75000",
    )
    b2 = Business(
        name="Bondar Coffee",
        slug="sveta-pizza",
        logo_url="https://example.com/logo.png",
        owner_email="owner@svydrina.com",
        description="Best pizza in town",
        country="France",
        city="Viljuif",
        address="2 Rue de Pizza",
        zip_code="93130",
    )
    async_session.add(b1)
    await async_session.commit()

    async_session.add(b2)
    with pytest.raises(Exception):
        await async_session.commit()


@pytest.mark.anyio
async def test_business_loyalty_token_relationship(async_session):
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
        mint="MINT123",
        symbol="BBPOINT",
        decimals=2,
        business_id=biz.id,
    )
    async_session.add(token)
    await async_session.commit()

    # load business avec loyalty_token
    result = await async_session.execute(
        select(Business).where(Business.id == biz.id)
    )
    biz_from_db = result.scalar_one()

    # if lazy="noload", then .loyalty_token need to refresh
    await async_session.refresh(biz_from_db)

    assert biz_from_db.loyalty_token is not None
    assert biz_from_db.loyalty_token.symbol == "BBPOINT"

    # check back connection
    result = await async_session.execute(
        select(Token).where(Token.mint == "MINT123")
    )
    token_from_db = result.scalar_one()

    assert token_from_db.business.id == biz.id
