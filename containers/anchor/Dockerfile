FROM rust:1.86-slim-bullseye

ARG ANCHOR_VERSION=0.29.0

RUN apt-get update && \
    cargo install --git https://github.com/coral-xyz/anchor avm --locked && \
    avm install ${ANCHOR_VERSION} && avm use ${ANCHOR_VERSION}

WORKDIR /anchor

COPY ../../srcs/backend/anchor ./anchor