import json
from redis import asyncio as aioredis
from app.core.settings import settings

async def publish(channel: str, message: dict):
    r = aioredis.from_url(settings.CELERY_BROKER, encoding="utf-8", decode_responses=True)
    await r.publish(channel, json.dumps(message))