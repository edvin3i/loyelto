FROM python:3.12-slim AS base

ARG S6_OVERLAY_VERSION=3.2.0.2

RUN apt-get update \
 && apt-get install -y --no-install-recommends xz-utils ca-certificates netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
ADD    https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz \
 && tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz \
 && rm /tmp/s6-overlay-*.tar.xz

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY containers/fastapi/config/s6 /etc/s6-overlay/s6-rc.d/
RUN chmod +x /etc/s6-overlay/s6-rc.d/uvicorn/run

WORKDIR /app
ADD ../../srcs/backend/loylapi /app

COPY containers/fastapi/entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh
RUN uv sync --no-cache

ENTRYPOINT ["sh", "/tmp/entrypoint.sh"]
WORKDIR /app
CMD ["sh", "/init"]
