import logging

logger = logging.getLogger("__name__")

import app.models  # noqa: F401
from pathlib import Path
from dotenv import load_dotenv

root = Path(__file__).parent.parent.parent.parent.parent.parent
load_dotenv(root / ".env")

import asyncio
from logging.config import fileConfig
from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import pool, text
from app.core.settings import settings
from app.db.base import Base

config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata

def ensure_extensions(sync_conn):
    """
    Create Postgres extensions required by the models.
    Runs ONLY on PostgreSQL back-ends; silently skips others.
    """
    if sync_conn.dialect.name == "postgresql":
        for ext in ("pgcrypto", "citext"):
            # AUTOCOMMIT, чтобы не открыть транзакцию
            sync_conn.exec_driver_sql(
                f"CREATE EXTENSION IF NOT EXISTS {ext}",
                execution_options={"isolation_level": "AUTOCOMMIT"},
            )


down_revision = None

def run_migrations_offline() -> None:
    """
    Migration without connection to DB
    :return:
    """

    url = settings.database_url
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
    logger.info(f"🔗 Connecting to database: {settings.database_url}")
    connectable = create_async_engine(
        settings.database_url,
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        logger.info("✅ Connected to database")
        await connection.run_sync(ensure_extensions)
        logger.info("✅ Extensions loaded")


        def do_migrations(sync_conn):
            logger.info("🚀 Starting migrations...")
            context.configure(
                connection=sync_conn,
                target_metadata=target_metadata,
                render_as_batch=(sync_conn.dialect.name == "sqlite"),
                compare_type=(sync_conn.dialect.name != "sqlite"),
                compare_server_default=True,
            )
            with context.begin_transaction():
                context.run_migrations()
                logger.info("✅ Migrations completed")

        await connection.run_sync(do_migrations)
        logger.info("✅ All migrations applied")

    await connectable.dispose()


def run() -> None:
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        asyncio.run(run_migrations_online())


run()
