FROM edvin3i/loyelto-fastapi:stage

CMD ["celery", "-A", "app.celery_app.celery", "beat", "--loglevel=info", "-S", "redbeat.RedBeatScheduler"]