import pytest
from sqlalchemy import select
from app.models import User


@pytest.mark.anyio
async def test_create_user(async_session):
    user = User(
        privy_id="test-privy-id",
        email="test@example.com",
        phone="+1234567890",
    )
    async_session.add(user)
    await async_session.commit()

    result = await async_session.execute(
        select(User).where(User.privy_id == "test-privy-id")
    )
    user_from_db = result.scalar_one()

    assert user_from_db.email == "test@example.com"
    assert user_from_db.phone == "+1234567890"


@pytest.mark.anyio
async def test_update_user_email(async_session):
    user = User(
        privy_id="user-2",
        email="old@example.com",
        phone="+1111111111",
    )
    async_session.add(user)
    await async_session.commit()

    user.email = "new@example.com"
    await async_session.commit()

    result = await async_session.execute(select(User).where(User.privy_id == "user-2"))
    user_from_db = result.scalar_one()

    assert user_from_db.email == "new@example.com"


@pytest.mark.anyio
async def test_delete_user(async_session):
    user = User(
        privy_id="user-3",
        email="delete@example.com",
        phone="+2222222222",
    )
    async_session.add(user)
    await async_session.commit()

    await async_session.delete(user)
    await async_session.commit()

    result = await async_session.execute(select(User).where(User.privy_id == "user-3"))
    user_from_db = result.scalar_one_or_none()

    assert user_from_db is None


@pytest.mark.anyio
async def test_user_uniqueness(async_session):
    user1 = User(
        privy_id="unique-user",
        email="unique1@example.com",
        phone="+3333333333",
    )
    user2 = User(
        privy_id="unique-user",
        email="unique2@example.com",
        phone="+4444444444",
    )
    async_session.add(user1)
    await async_session.commit()

    async_session.add(user2)
    with pytest.raises(Exception):
        await async_session.commit()  # must crash with unique constraint
