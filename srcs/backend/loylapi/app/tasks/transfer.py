from app.celery_app import celery
from app.services.transfer_exec import earn_token, redeem_token
from app.services.celery_wrapper import log_task


@celery.task(name="onchain.transfer_earn", queue="onchain", bind=True, max_retries=3)
@log_task
def transfer_earn_task(
    self, *, business_kp_b58: str, mint: str, user_pubkey: str, amount: int
):
    """
    Celery wrapper for business → user transfer.
    """
    try:
        earn_token(mint, user_pubkey, business_kp_b58, amount)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)


@celery.task(name="onchain.transfer_redeem", queue="onchain", bind=True, max_retries=3)
@log_task
def transfer_redeem_task(
    self, *, user_pubkey: str, mint: str, business_pubkey: str, amount: int
):
    """
    Celery wrapper for user → business transfer.
    """
    try:
        redeem_token(mint, user_pubkey, business_pubkey, amount)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)
