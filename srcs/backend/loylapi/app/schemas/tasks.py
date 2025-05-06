import datetime
from uuid import UUID
from pydantic import json
from app.schemas.types import LimitedStr, TaskStatusEnum
from app.schemas.base import BaseSchema, BaseDBSchema


class CeleryTaskLogCreate(BaseSchema):
    task_id: LimitedStr(1, 50)
    queue: LimitedStr(1, 32)
    status: TaskStatusEnum
    payload: dict | None
    result: LimitedStr(1, 32) | None


class CeleryTaskLogUpdate(BaseSchema):
    status: TaskStatusEnum = None
    payload: dict | None = None
    result: LimitedStr(1, 32) | None = None


class CeleryTaskLogOut(BaseDBSchema):
    task_id: LimitedStr(1, 50)
    queue: LimitedStr(1, 32)
    status: TaskStatusEnum
    payload: dict | None
    result: LimitedStr(1, 32) | None
