import pytest
from sqlalchemy import select
from app.models import SwapTx, Token, Business, User

@pytest.mark.anyio
async def test_create_swap_tx(async_session):
    # prepare
    user = User(privy_id="swapu", email="swap@example.com", phone="+400")
    async_session.add(user)
    await async_session.commit()

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

    t1 = Token(mint="SWAP1", symbol="S1", business_id=biz.id)
    t2 = Token(mint="SWAP2", symbol="S2", business_id=biz.id)
    async_session.add_all([t1, t2])
    await async_session.commit()

    tx = SwapTx(
        user_id=user.id,
        from_token_id=t1.id,
        to_token_id=t2.id,
        from_amount=500,
        to_amount=450,
        fee_bps=10,
        sol_sig="swap_sig",
    )
    async_session.add(tx)
    await async_session.commit()

    result = await async_session.execute(
        select(SwapTx).where(SwapTx.sol_sig == "swap_sig")
    )
    tx_db = result.scalar_one()
    assert tx_db.from_amount == 500
    assert tx_db.to_amount == 450
    assert tx_db.user_id == user.id
