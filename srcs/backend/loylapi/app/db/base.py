from __future__ import annotations
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    repr_cols_num = 2  # just for __repr__
