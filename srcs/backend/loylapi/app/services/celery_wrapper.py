"""Thread-safe logging decorator for Celery tasks (async-db aware)."""

from __future__ import annotations
import asyncio
from functools import wraps
from typing import Any, Callable, ParamSpec, TypeVar
from celery import Task
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models import CeleryTaskLog, TaskStatus

_R = TypeVar("_R")
_P = ParamSpec("_P")


def log_task(fn: Callable[_P, _R]) -> Callable[_P, _R]:
    """Wrap a Celery task and persist run metadata in `celery_task_logs` table."""

    @wraps(fn)
    def _inner(self: Task, *args: _P.args, **kwargs: _P.kwargs) -> _R:  # type: ignore[name-defined]
        async def _log(result: str | None, status: TaskStatus) -> None:
            async with AsyncSessionLocal() as db:  # type: AsyncSession
                db.add(
                    CeleryTaskLog(
                        task_id=self.request.id,
                        queue=self.request.delivery_info["routing_key"],
                        status=status,
                        payload={"args": args, "kwargs": kwargs},
                        result=(result or "")[:88],
                    )
                )
                await db.commit()

        try:
            result: Any = fn(self, *args, **kwargs)  # task body (sync)
            asyncio.run(_log(str(result), TaskStatus.SUCCESS))
            return result  # type: ignore[return-value]
        except Exception as exc:  # noqa: BLE001
            asyncio.run(_log(None, TaskStatus.FAILED))
            raise exc

    return _inner
