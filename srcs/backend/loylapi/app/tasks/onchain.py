from app.celery_app import celery


@celery.task(name="onchain.swap", bind=True, max_retries=3)
def swap_task(self, swap_tx_id: str):
    """
    Pull swap parameters from DB, execute Anchor swap,
    update `SwapTx.sol_sig` + status.
    """
    from app.services.swap_exec import perform_swap

    try:
        perform_swap(swap_tx_id)
    except Exception as exc:
        # retry in 10 seconds if fail
        raise self.retry(exc=exc, countdown=10, queue="onchain")
