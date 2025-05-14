STACK           ?= stage
PROJECT         := loyelto-$(STACK)
ENV_FILE        := infra/env/$(STACK).env
DOCKER_COMPOSE  := docker compose
COMPOSE_FILES   := -f infra/base.yml -f infra/$(STACK).yml

create-networks:
	@docker network inspect tnet-stage >/dev/null 2>&1 || docker network create tnet-stage
	@docker network inspect tnet-prod  >/dev/null 2>&1 || docker network create tnet-prod

build:
	@echo "Building images for $(STACK)..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) build

up-router:
	@echo ">>> Checking Traefik..."
	@docker compose -p loyelto-router -f infra/traefik.yml ps -q >/dev/null 2>&1 \
		|| (echo ">>> Starting Traefik..." && docker compose -p loyelto-router -f infra/traefik.yml up -d)

down-router:
	@docker compose -p loyelto-router -f infra/traefik.yml down

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
	@test -f $(ENV_FILE) || (echo "env file '$(ENV_FILE)' not found" && exit 1)
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) up -d

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

start:
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) start

stop:
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) stop

re:
	@echo ">>> Recreate '$(STACK)' stack from scratch..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) down --rmi all --volumes --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) up -d

list:
	docker ps

clean:
	@echo ">>> Clean '$(STACK)' stack and prune docker..."
	@$(DOCKER_COMPOSE) -p $(PROJECT) --env-file $(ENV_FILE) $(COMPOSE_FILES) down --rmi all --volumes --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f

.PHONY: \
	create-networks build up up-dev up-stage up-prod up-run \
	down down-dev down-stage down-prod down-run \
	up-router down-router start stop re list clean
