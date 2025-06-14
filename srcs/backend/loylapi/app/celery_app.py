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

celery.conf.beat_schedule = {
    "confirm-solana-txs": {
        "task": "onchain.confirm_tx",
        "schedule": 30.0,  # every 30 secs
        "options": {"queue": "onchain"},
    }
}
celery.conf.update(
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_acks_on_failure_or_timeout=True,
    task_default_rate_limit="20/s",
)
