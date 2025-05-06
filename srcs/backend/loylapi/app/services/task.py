from app.services.base import BaseService
from app.crud.base import CRUDBase
from app.models.tasks import CeleryTaskLog
from app.schemas.tasks import CeleryTaskLogCreate, CeleryTaskLogUpdate

crud_celery_task = CRUDBase[CeleryTaskLog, CeleryTaskLogCreate, CeleryTaskLogUpdate](CeleryTaskLog)

class CeleryTaskService(BaseService[CeleryTaskLog, CeleryTaskLogCreate, CeleryTaskLogUpdate]):
    pass

celery_task_service = CeleryTaskService(crud_celery_task)