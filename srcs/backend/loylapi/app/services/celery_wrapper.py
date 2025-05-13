from functools import wraps
from celery import Task
from app.models import CeleryTaskLog, TaskStatus
from app.db.session import AsyncSessionLocal

def log_task(fn):
    @wraps(fn)
    def _inner(self: Task, *args, **kwargs):
        db = AsyncSessionLocal()
        status = TaskStatus.PENDING
        result = None
        try:
            result = fn(self, *args, **kwargs)  # may return tx_sig
        finally:
            db.add(
                CeleryTaskLog(
                    task_id=self.request.id,
                    queue=self.request.delivery_info["routing_key"],
                    status=status,
                    payload={"args": args, "kwargs": kwargs},
                    result=str(result)[:88] if result else None,
                )
            )
            db.commit()
            db.close()
        return result
    return _inner