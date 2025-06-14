"""Periodic confirmation of outbound Solana transactions."""

from __future__ import annotations
import asyncio, logging
from typing import List
from celery import Celery
from solana.rpc.async_api import AsyncClient
from sqlalchemy import select
from app.core.settings import settings
from app.db.session import AsyncSessionLocal
from app.models import CeleryTaskLog, TaskStatus
from app.celery_app import celery
from app.services.celery_wrapper import log_task

log = logging.getLogger(__name__)
celery: Celery  # autodiscovered by Celery


def _confirm_all() -> None:
    """Async helper: poll pending tasks and update statuses."""

    async def _run():
        async with AsyncSessionLocal() as db, AsyncClient(
            settings.SOLANA_RPC_URL
        ) as rpc:
            # 1) We collect all PENDING logs with real results.
            stmt = select(CeleryTaskLog).where(
                CeleryTaskLog.status == TaskStatus.PENDING,
                CeleryTaskLog.result.is_not(None),
            )
            pending = (await db.execute(stmt)).scalars().all()
            if not pending:
                return

            # 2) We take a list of caption strings
            sigs: List[str] = [
                log_entry.result for log_entry in pending if log_entry.result
            ]

            # 3) We request the statuses.
            res = await rpc.get_signature_statuses(sigs)
            statuses = res.value

            # 4) Updating records
            for entry, status in zip(pending, statuses, strict=True):
                if status and status.confirmations is not None and status.err is None:
                    entry.status = TaskStatus.SUCCESS
                elif status and status.err is not None:
                    entry.status = TaskStatus.FAILED

            await db.commit()

    asyncio.run(_run())


@celery.task(
    name="onchain.confirm_tx",
    queue="onchain",
    bind=True,
    max_retries=None,
)
@log_task
def confirm_tx(self) -> None:
    """
    Celery task: runs every 30s via beat_schedule.
    Calls Solana RPC get_signature_statuses on all pending txs,
    marks SUCCESS or FAILED in CeleryTaskLog.
    """
    try:
        _confirm_all()
    except Exception as exc:
        log.error("confirm_tx failed: %s", exc, exc_info=True)
        # We don't retract — the next launch after beat will retry.
