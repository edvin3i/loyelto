import pytest
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.models import User, Wallet


@pytest.mark.anyio
async def test_create_wallet_and_user_relationship(async_session):
    user = User(
        privy_id="wallet-user-1",
        email="wallet1@example.com",
        phone="+70000000001",
    )
    async_session.add(user)
    await async_session.commit()

    wallet = Wallet(
        user_id=user.id,
        pubkey="WALLET_PUBKEY_ABC123",
    )
    async_session.add(wallet)
    await async_session.commit()

    # test wallet → user
    result = await async_session.execute(
        select(Wallet)
        .options(joinedload(Wallet.user))
        .where(Wallet.pubkey == "WALLET_PUBKEY_ABC123")
    )
    wallet_from_db = result.scalar_one()

    assert wallet_from_db.user.id == user.id
    assert wallet_from_db.user.privy_id == "wallet-user-1"

    # test user → wallets
    result = await async_session.execute(select(User).where(User.id == user.id))
    user_from_db = result.scalar_one()

    assert len(user_from_db.wallets) == 1
    assert user_from_db.wallets[0].pubkey == "WALLET_PUBKEY_ABC123"


@pytest.mark.anyio
async def test_wallet_unique_constraint(async_session):
    user = User(
        privy_id="wallet-user-2",
        email="wallet2@example.com",
        phone="+70000000002",
    )
    async_session.add(user)
    await async_session.commit()

    pubkey = "WALLET_PUBKEY_DUPLICATE"

    w1 = Wallet(user_id=user.id, pubkey=pubkey)
    w2 = Wallet(user_id=user.id, pubkey=pubkey)  # the same pubkey

    async_session.add(w1)
    await async_session.commit()

    async_session.add(w2)
    with pytest.raises(Exception):
        await async_session.commit()  # awaiting the crash on unique (user_id, pubkey)
