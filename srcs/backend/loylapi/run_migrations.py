import sys
import logging

from alembic.config import Config
from alembic import command

alembic_cfg = Config("alembic.ini")

logging.getLogger("alembic").setLevel(logging.INFO)
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

if __name__ == "__main__":
    command.upgrade(alembic_cfg, "head")