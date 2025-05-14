from app.celery_app import celery
from app.services.token_mint import mint_and_record  # need to implement
from app.services.celery_wrapper import log_task


@celery.task(name="onchain.mint_token", queue="onchain")
@log_task
def mint_token_task(business_id: str):
    """Mint SPL-2022 token & init pool."""
    mint_and_record(business_id)
