from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from uuid import UUID
from app.ws.manager import WSManager
from app.models.transactions import SwapTx
from app.db.session import AsyncSessionLocal

router = APIRouter(prefix="/ws")


@router.websocket("/swap/{swap_id}")
async def swap_ws(ws: WebSocket, swap_id: str):
    """
    Client subscribes right after POST /swap_txs.
    Server streams JSON payloads:
      {"swap_id": "...", "event": "pending|success|failed"}
    """
    # quick existence check
    async with AsyncSessionLocal() as db:
        if not await db.get(SwapTx, UUID(swap_id)):
            await ws.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    mgr = WSManager()
    await mgr.connect(swap_id, ws)

    try:
        while True:
            await ws.receive_text()  # keep-alive ping-pong
    except WebSocketDisconnect:
        await mgr.disconnect(swap_id, ws)
