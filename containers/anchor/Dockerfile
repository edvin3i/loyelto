FROM rust:1.79-slim-bullseye AS builder
ARG ANCHOR_VERSION=0.29.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     build-essential \
     pkg-config \
     libudev-dev \
     libssl-dev \
     git \
     curl \
  && rm -rf /var/lib/apt/lists/*

RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked \
  && avm install ${ANCHOR_VERSION} \
  && avm use ${ANCHOR_VERSION}

WORKDIR /anchor
COPY ../../srcs/backend/anchor .

RUN anchor build --workspace -- --release

# Stage 2: Minimal runtime with only the Anchor CLI binary
FROM debian:bullseye-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/cargo/bin/anchor /usr/local/bin/anchor
COPY --from=builder /anchor/target /anchor/target

WORKDIR /anchor
ENTRYPOINT ["anchor"]
CMD ["--version"]



# FROM rust:1.79-slim-bullseye

# ARG ANCHOR_VERSION=0.29.0

# RUN apt-get update && \
#     cargo install --git https://github.com/coral-xyz/anchor avm --locked && \
#     avm install ${ANCHOR_VERSION} && avm use ${ANCHOR_VERSION}

# WORKDIR /anchor

# COPY ../../srcs/backend/anchor ./anchor