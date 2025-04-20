import pytest
from sqlalchemy import select
from app.models import VoucherTemplate, VoucherStatus, VoucherNFT, Business

@pytest.mark.anyio
async def test_create_voucher_template(async_session):
    biz = Business(name="Bondar Coffee",
                   slug="bondar-coffee",
                   logo_url="https://example.com/logo.png",
                   owner_email="owner@iBondar.pro",
                   description="Best coffee in town",
                   country="France",
                   city="Paris",
                   address="1 Rue de Café",
                   zip_code="75000",)
    async_session.add(biz)
    await async_session.commit()

    tmpl = VoucherTemplate(
        business_id=biz.id,
        name="10% OFF",
        description="Discount coupon",
        price_points=100,
        supply=5,
    )
    async_session.add(tmpl)
    await async_session.commit()

    result = await async_session.execute(
        select(VoucherTemplate).where(VoucherTemplate.name == "10% OFF")
    )
    tmpl_db = result.scalar_one()
    assert tmpl_db.price_points == 100
    assert tmpl_db.supply == 5
    assert tmpl_db.vouchers == [] # empty list of related vouchers

@pytest.mark.anyio
async def test_voucher_template_cascade_delete(async_session):
    biz = Business(name="Bondar Coffee",
                   slug="bondar-coffee",
                   logo_url="https://example.com/logo.png",
                   owner_email="owner@iBondar.pro",
                   description="Best coffee in town",
                   country="France",
                   city="Paris",
                   address="1 Rue de Café",
                   zip_code="75000",)
    async_session.add(biz)
    await async_session.commit()

    tmpl = VoucherTemplate(
        business_id=biz.id,
        name="Free Mug",
        price_points=200,
        supply=1,
    )
    async_session.add(tmpl)
    await async_session.commit()

    nft = VoucherNFT(template_id=tmpl.id, user_id=None, asset_id="asset1")
    async_session.add(nft)
    await async_session.commit()

    # remove template — NFT must be fail too
    await async_session.delete(tmpl)
    await async_session.commit()

    result = await async_session.execute(
        select(VoucherNFT).where(VoucherNFT.asset_id == "asset1")
    )
    assert result.scalar_one_or_none() is None
