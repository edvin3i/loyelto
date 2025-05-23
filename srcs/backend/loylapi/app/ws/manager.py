from __future__ import annotations
import json, asyncio
from typing import Dict, Set
from fastapi import WebSocket
from app.ws.ws_redis import redis_conn


class WSManager:
    """
    Keeps in-memory mapping swap_id → set[WebSocket],
    relays Redis pubsub messages to connected clients.
    """

    _instance: "WSManager" | None = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init()
        return cls._instance

    # --------------------------------------------------------------------- #
    def _init(self) -> None:
        self._clients: Dict[str, Set[WebSocket]] = {}
        self._redis = redis_conn()
        self._loop_task = asyncio.create_task(self._redis_listener())

    async def _redis_listener(self) -> None:
        """
        Background task: subscribes to channel "swap:*", relays payloads.
        Payload format: {"swap_id": <uuid>, "event": "success|failed|pending"}
        """
        pubsub = self._redis.pubsub()
        await pubsub.psubscribe("swap:*")

        async for msg in pubsub.listen():
            if msg["type"] != "pmessage":
                continue
            payload = json.loads(msg["data"])
            swap_id = payload["swap_id"]
            clients = list(self._clients.get(swap_id, set()))
            for ws in clients:
                try:
                    await ws.send_json(payload)
                except Exception:  # noqa: BLE001
                    await self.disconnect(swap_id, ws)

    # ------------------------------------------------------------------ API
    async def connect(self, swap_id: str, ws: WebSocket) -> None:
        await ws.accept()
        self._clients.setdefault(swap_id, set()).add(ws)

    async def disconnect(self, swap_id: str, ws: WebSocket) -> None:
        conns = self._clients.get(swap_id)
        if conns and ws in conns:
            conns.remove(ws)
            await ws.close()
        if conns and not conns:
            self._clients.pop(swap_id, None)
