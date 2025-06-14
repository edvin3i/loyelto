"""Singleton async Redis connection using redis>=4.0."""

from __future__ import annotations
from functools import lru_cache
from redis.asyncio import Redis as _Redis
from app.core.settings import settings


@lru_cache(maxsize=1)
def redis_conn() -> _Redis:
    return _Redis.from_url(settings.CELERY_BROKER, decode_responses=True)
