import app.models  # noqa: F401
from pathlib import Path
from dotenv import load_dotenv

root = Path(__file__).parent.parent.parent.parent.parent.parent
load_dotenv(root / ".env")
print(root)


import asyncio
from logging.config import fileConfig
from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import pool
from app.core.settings import settings
from app.db.base import Base


config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata

down_revision = None

def run_migrations_offline() -> None:
    """
    Migration without connection to DB
    :return:
    """

    url = settings.database_url
    print(f"=================== {url} ======================")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """
    Migrations over asyncio engine
    :return:
    """
    connectable = create_async_engine(
        settings.database_url, future=True, poolclass=pool.NullPool
    )
    async with connectable.connect() as connection:
        await connection.run_sync(
            lambda sync_conn: context.configure(
                connection=sync_conn,
                target_metadata=target_metadata,
                render_as_batch=True,
                # compare_type=True,
                compare_type=(sync_conn.dialect.name != "sqlite"),
            )
        )
        async with connection.begin():
            await connection.run_sync(lambda sync_conn: context.run_migrations())
    await connectable.dispose()


def run() -> None:
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        asyncio.run(run_migrations_online())


run()
