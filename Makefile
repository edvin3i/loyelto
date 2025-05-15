# ========== CONFIG ==========
STACK           ?= stage
PROJECT         := loyelto-$(STACK)
ENV_FILE        := $(CURDIR)/infra/env/$(STACK).env
DOCKER_COMPOSE  := docker compose
COMPOSE_FILES   := -f infra/base.yml -f infra/$(STACK).yml

# ========== NETWORKS ==========
create-networks:
	@docker network inspect tnet-stage >/dev/null 2>&1 || docker network create tnet-stage
	@docker network inspect tnet-prod  >/dev/null 2>&1 || docker network create tnet-prod

# ========== BUILD ==========
build:
	@echo ">>> Building images for $(STACK)..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) build

# ========== TRAEFIK ==========
up-router:
	@echo ">>> Checking Traefik..."
	@if ! docker ps --filter "name=loyelto-router-traefik-1" --filter "status=running" -q | grep -q .; then \
		echo ">>> Starting Traefik..."; \
		docker compose -p loyelto-router -f infra/traefik.yml up -d; \
	else \
		echo ">>> Traefik already running."; \
	fi

down-router:
	@docker compose -p loyelto-router -f infra/traefik.yml down

# ========== UP ==========
up:
	@echo "Usage: make up-[dev|stage|prod]"

up-dev:
	@$(MAKE) STACK=dev up-run

up-stage: create-networks
	@$(MAKE) up-router
	@$(MAKE) STACK=stage up-run

up-prod: create-networks
	@$(MAKE) up-router
	@$(MAKE) STACK=prod up-run

up-run:
	@echo ">>> Starting '$(STACK)' stack..."
	@test -f $(ENV_FILE) || (echo "ERROR: env file '$(ENV_FILE)' not found" && exit 1)
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) up -d

# ========== DOWN ==========
down:
	@echo "Usage: make down-[dev|stage|prod]"

down-dev:
	@$(MAKE) STACK=dev down-run

down-stage:
	@$(MAKE) STACK=stage down-run

down-prod:
	@$(MAKE) STACK=prod down-run

down-run:
	@echo ">>> Stopping '$(STACK)' stack..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) down

# ========== RESTART ==========
re:
	@echo ">>> Recreate '$(STACK)' stack from scratch..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) down --rmi all --volumes --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) up -d

# ========== CLEAN ==========
clean:
	@echo ">>> Full clean of '$(STACK)'..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) down --rmi all --volumes --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f

# ========== MISC ==========
list:
	docker ps

.PHONY: \
	create-networks build up-router down-router \
	up up-dev up-stage up-prod up-run \
	down down-dev down-stage down-prod down-run \
	re clean list
