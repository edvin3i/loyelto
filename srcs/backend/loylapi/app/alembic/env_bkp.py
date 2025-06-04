print("DEBUG: THIS IS MY ALEMBIC ENV!!!")

import logging
logger = logging.getLogger(__name__)

import app.models  # noqa: F401
from pathlib import Path
from dotenv import load_dotenv

root = Path(__file__).parent.parent.parent.parent.parent.parent
load_dotenv(root / ".env")

from logging.config import fileConfig
from alembic import context
from sqlalchemy import create_engine
from sqlalchemy import pool, text
from app.core.settings import settings
from app.db.base import Base

print("DEBUG: settings.database_url =", settings.database_url)

config = context.config
fileConfig(config.config_file_name)

real_sync_url = settings.database_url.replace("+asyncpg", "")
config.set_main_option("sqlalchemy.url", real_sync_url)

target_metadata = Base.metadata

def ensure_extensions(sync_conn):
    """
    Create Postgres extensions required by the models.
    Runs ONLY on PostgreSQL back-ends; silently skips others.
    """
    if sync_conn.dialect.name == "postgresql":
        for ext in ("pgcrypto", "citext"):
            # AUTOCOMMIT
            sync_conn.exec_driver_sql(
                f"CREATE EXTENSION IF NOT EXISTS {ext}",
                execution_options={"isolation_level": "AUTOCOMMIT"},
            )
            logger.info(f"✅ Extension '{ext}' ensured")


def run_migrations_offline() -> None:
    """
    Migration without connection to DB
    :return:
    """

    url = url = settings.database_url.replace("+asyncpg", "")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
        Migrations over sync engine
        :return:
    """
    logger.info(f"🔗 Connecting to database: {settings.database_url}")
    url = config.get_main_option("sqlalchemy.url")
    connectable = create_engine(
        url,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        logger.info("✅ Connected to database")
        ensure_extensions(connection)
        logger.info("✅ Extensions loaded")



        logger.info("🚀 Starting migrations...")
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=(connection.dialect.name == "sqlite"),
            compare_type=(connection.dialect.name != "sqlite"),
            compare_server_default=True,
            **{"raiseerr": True},
            )
        with context.begin_transaction():
            context.run_migrations()
            logger.info("✅ Migrations completed")
        logger.info("✅ All migrations applied")

    connectable.dispose()


def run() -> None:
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        run_migrations_online()


run()