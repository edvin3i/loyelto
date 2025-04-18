FROM python:3.12-alpine

ARG S6_OVERLAY_VERSION=3.2.0.2

RUN apk update && apk upgrade && apk add xz s6 s6-rc
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY containers/fastapi/config/s6 /etc/s6-overlay/s6-rc.d/
RUN chmod +x /etc/s6-overlay/s6-rc.d/uvicorn/run

WORKDIR /app
ADD ../../srcs/backend/loylapi /app

COPY containers/fastapi/entrypoint.sh /tmp/entrypoint.sh

RUN uv sync --no-cache

ENTRYPOINT [ "sh", "/tmp/entrypoint.sh" ]

WORKDIR /app/app

CMD ["sh", "/init"]

# CMD [ "uv", "run", "gunicorn", "-b", "0.0.0.0:8000", "transa.wsgi" ]
# CMD ["uv", "run", "python3", "manage.py", "runserver", "0.0.0.0:8000"]
# CMD ["sh", "-c", "if [ \"$DJANGO_MODE\" = \"dev\" ]; then exec uv run python3 manage.py runserver 0.0.0.0:8000; else exec uv run gunicorn -b 0.0.0.0:8000 transa.wsgi:application; fi"]
