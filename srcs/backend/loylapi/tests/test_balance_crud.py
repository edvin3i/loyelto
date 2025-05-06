import pytest
from sqlalchemy import select
from app.models import Balance, Wallet, Token, Business, User

@pytest.mark.anyio
async def test_create_balance(async_session):
    # prepare: creating User, Wallet, Business and Token
    user = User(privy_id="u1", email="u1@example.com", phone="+100")
    async_session.add(user)
    await async_session.commit()

    wallet = Wallet(user_id=user.id, pubkey="pubkey1")
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

    token = Token(mint="MINT1", symbol="M1", business_id=biz.id)
    async_session.add(token)
    await async_session.commit()

    # create Balance
    bal = Balance(wallet_id=wallet.id, token_id=token.id, amount=100)
    async_session.add(bal)
    await async_session.commit()

    result = await async_session.execute(
        select(Balance).where(Balance.wallet_id == wallet.id)
    )
    bal_db = result.scalar_one()
    assert bal_db.amount == 100
    assert bal_db.token_id == token.id

@pytest.mark.anyio
async def test_balance_unique_constraint(async_session):
    # same for Wallet/Token
    user = User(privy_id="u2", email="u2@example.com", phone="+200")
    async_session.add(user)
    await async_session.commit()

    wallet = Wallet(user_id=user.id, pubkey="pubkey2")
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

    token = Token(mint="MINT2", symbol="T2", business_id=biz.id)
    async_session.add(token)
    await async_session.commit()

    # two balances with the same wallet_id and token_id
    b1 = Balance(wallet_id=wallet.id, token_id=token.id, amount=50)
    b2 = Balance(wallet_id=wallet.id, token_id=token.id, amount=75)
    async_session.add(b1)
    await async_session.commit()

    async_session.add(b2)
    with pytest.raises(Exception):
        await async_session.commit()
