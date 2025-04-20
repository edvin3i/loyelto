# tests/test_celery_task_log.py
import pytest
from sqlalchemy import select
from app.models import CeleryTaskLog, TaskStatus

@pytest.mark.anyio
async def test_create_celery_task_log(async_session):
    log = CeleryTaskLog(
        task_id="task123",
        queue="default",
        status=TaskStatus.PENDING,
        payload={"foo": "bar"},
        result=None,
    )
    async_session.add(log)
    await async_session.commit()

    result = await async_session.execute(
        select(CeleryTaskLog).where(CeleryTaskLog.task_id == "task123")
    )
    log_db = result.scalar_one()
    assert log_db.status == TaskStatus.PENDING
    assert log_db.payload == {"foo": "bar"}

@pytest.mark.anyio
async def test_celery_task_log_unique_constraint(async_session):
    l1 = CeleryTaskLog(task_id="dup", queue="q", status=TaskStatus.SUCCESS)
    l2 = CeleryTaskLog(task_id="dup", queue="q2", status=TaskStatus.FAILED)
    async_session.add(l1)
    await async_session.commit()

    async_session.add(l2)
    with pytest.raises(Exception):
        await async_session.commit()
