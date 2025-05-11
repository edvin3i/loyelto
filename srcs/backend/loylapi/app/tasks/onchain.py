from app.celery_app import celery

@celery.task(name="onchain.swap")
def swap_task(token_id: str, user_id: str):
    # just log rn
    print(f"Swapping token {token_id} for user {user_id}")