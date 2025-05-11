from functools import wraps
from celery import Task
from app.models.tasks import CeleryTaskLog, TaskStatus
from app.db.session import AsyncSessionLocal

def log_task(fn):
    @wraps(fn)
    def _inner(self: Task, *a, **kw):
        session = AsyncSessionLocal()
        try:
            res = fn(self, *a, **kw)
            status = TaskStatus.SUCCESS
            return res
        except Exception as exc:
            status = TaskStatus.RETRY if self.request.retries else TaskStatus.FAILED
            raise
        finally:
            session.add(
                CeleryTaskLog(
                    task_id=self.request.id,
                    queue=self.request.delivery_info["routing_key"],
                    status=status,
                    payload={"args": a, "kwargs": kw},
                    result=str(res)[:32] if status == TaskStatus.SUCCESS else None,
                )
            )
            session.commit()
            session.close()
    return _inner
