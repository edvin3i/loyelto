import pytest
from sqlalchemy import select
from app.models import VoucherTemplate, VoucherNFT, VoucherStatus, Business, User

@pytest.mark.anyio
async def test_create_voucher_nft_and_relations(async_session):
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
        name="Ticket",
        price_points=300,
        supply=10,
    )
    async_session.add(tmpl)
    await async_session.commit()

    user = User(privy_id="vnftuser", email="vn@example.com", phone="+500")
    async_session.add(user)
    await async_session.commit()

    nft = VoucherNFT(template_id=tmpl.id, user_id=user.id, asset_id="ticket123")
    async_session.add(nft)
    await async_session.commit()

    result = await async_session.execute(
        select(VoucherNFT).where(VoucherNFT.asset_id == "ticket123")
    )
    nft_db = result.scalar_one()
    # default fields
    assert nft_db.status == VoucherStatus.ACTIVE
    assert nft_db.user_id == user.id
    # connections
    await async_session.refresh(nft_db)
    assert nft_db.template.id == tmpl.id
