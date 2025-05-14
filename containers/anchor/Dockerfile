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

# Create workdir and copy your Anchor program source
WORKDIR /anchor
COPY ../../srcs/backend/anchor .

# Build the Anchor program (and Anchor CLI)
RUN anchor build --workspace -- --release  # uses AVM’s anchor cli :contentReference[oaicite:3]{index=3}

# Stage 2: Minimal runtime with only the Anchor CLI binary
FROM debian:bullseye-slim AS runtime  # minimal base :contentReference[oaicite:4]{index=4}

# Install CA certificates (so Anchor CLI can talk RPC securely)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy the built Anchor CLI and your program IDLs/artifacts
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