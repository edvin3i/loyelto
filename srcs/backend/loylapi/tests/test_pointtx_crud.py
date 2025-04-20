import pytest
from sqlalchemy import select
from app.models import PointTx, TxType, Wallet, Token, Business, User

@pytest.mark.anyio
async def test_create_point_tx(async_session):
    # prepare
    user = User(privy_id="ptxuser", email="ptx@example.com", phone="+300")
    async_session.add(user)
    await async_session.commit()

    wallet = Wallet(user_id=user.id, pubkey="ptx_pub")
    biz = Business(name="Bondar Coffee",
                   slug="bondar-coffee",
                   logo_url="https://example.com/logo.png",
                   owner_email="owner@iBondar.pro",
                   description="Best coffee in town",
                   country="France",
                   city="Paris",
                   address="1 Rue de Café",
                   zip_code="75000",)
    async_session.add_all([wallet, biz])
    await async_session.commit()

    token = Token(mint="PTXMINT", symbol="PTX", business_id=biz.id)
    async_session.add(token)
    await async_session.commit()

    # create PointTx
    tx = PointTx(
        wallet_id=wallet.id,
        token_id=token.id,
        tx_type=TxType.EARN,
        amount=1000,
        fee_bps=15,
        sol_sig="sig_ptx",
    )
    async_session.add(tx)
    await async_session.commit()

    result = await async_session.execute(
        select(PointTx).where(PointTx.sol_sig == "sig_ptx")
    )
    tx_db = result.scalar_one()
    assert tx_db.amount == 1000
    assert tx_db.tx_type == TxType.EARN
    assert tx_db.fee_bps == 15
