FROM edvin3i/loyelto-fastapi:stage

CMD ["celery", "-A", "app.celery_app.celery", "worker", "--loglevel=info", "--concurrency=4", "-Q", "onchain,default"]