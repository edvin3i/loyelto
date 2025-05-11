from app.api.crud_router import create_crud_router
from app.services.task import celery_task_service
from app.schemas.tasks import CeleryTaskLogCreate, CeleryTaskLogUpdate, CeleryTaskLogOut

router = create_crud_router(
    crud=celery_task_service.crud,
    create_schema=CeleryTaskLogCreate,
    update_schema=CeleryTaskLogUpdate,
    out_schema=CeleryTaskLogOut,
    prefix="/tasks",
    tags=["tasks"],
)
