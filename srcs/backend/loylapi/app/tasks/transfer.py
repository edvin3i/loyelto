from app.celery_app import celery
from app.services.transfer_exec import earn_token, redeem_token


@celery.task(name="onchain.transfer_earn", queue="onchain", bind=True, max_retries=3)
def transfer_earn_task(
    self, *, business_kp_b58: str, mint: str, user_pubkey: str, amount: int
):
    """
    Celery wrapper for business → user transfer.
    """
    try:
        earn_token(business_kp_b58, mint, user_pubkey, amount)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)


@celery.task(name="onchain.transfer_redeem", queue="onchain", bind=True, max_retries=3)
def transfer_redeem_task(
    self, *, user_pubkey: str, mint: str, business_pubkey: str, amount: int
):
    """
    Celery wrapper for user → business transfer.
    """
    try:
        redeem_token(user_pubkey, mint, business_pubkey, amount)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)
