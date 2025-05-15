FROM rust:1.79-slim-bullseye AS builder

ARG ANCHOR_VERSION=0.29.0

RUN apt-get update \
 && apt-get install -y --no-install-recommends git pkg-config libssl-dev \
 && rm -rf /var/lib/apt/lists/*

RUN cargo install \
      --git https://github.com/coral-xyz/anchor \
      --tag v${ANCHOR_VERSION} \
      --locked \
      avm \
 && avm install ${ANCHOR_VERSION} \
 && avm use     ${ANCHOR_VERSION}

FROM debian:bullseye-slim AS runtime

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates bash \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /anchor
COPY ../../srcs/backend/anchor .
RUN avm use 0.29.0 && \
    anchor build

COPY --from=builder /usr/local/cargo/bin/avm /usr/local/bin/avm
COPY --from=builder /root/.avm /root/.avm
COPY --from=builder /root/.config/anchor /root/.config/anchor

ENV PATH="/root/.avm/bin:${PATH}"
ENV ANCHOR_VERSION=0.29.0



ENTRYPOINT ["avm"]




# FROM rust:1.79-slim-bullseye

# ARG ANCHOR_VERSION=0.29.0

# RUN apt-get update && \
#     cargo install --git https://github.com/coral-xyz/anchor avm --locked && \
#     avm install ${ANCHOR_VERSION} && avm use ${ANCHOR_VERSION}

# WORKDIR /anchor

# COPY ../../srcs/backend/anchor ./anchor