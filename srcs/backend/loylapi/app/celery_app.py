from celery import Celery
from app.core.settings import settings

celery = Celery(
    "loyelto",
    broker=settings.CELERY_BROKER,
    backend=settings.CELERY_BACKEND,
)
# for all onchain.* goes to "onchain"
celery.conf.task_routes = {"onchain.*": {"queue": "onchain"}}
celery.autodiscover_tasks(["app.tasks"])
