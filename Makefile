STACK ?= dev
DOCKER_COMPOSE := docker compose
COMPOSE_FILES := \
	-p loyelto-$(STACK) \
	-f infra/base.yml \
	-f infra/$(STACK).yml

create-networks:
	@docker network inspect tnet-stage >/dev/null 2>&1 || docker network create tnet-stage
	@docker network inspect tnet-prod  >/dev/null 2>&1 || docker network create tnet-prod

build:
	@echo "Building images for $(STACK)..."
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) build

up-router:
	$(DOCKER_COMPOSE) -p loyelto-router -f infra/traefik.yml up -d

down-router:
	$(DOCKER_COMPOSE) -p loyelto-router -f infra/traefik.yml down


up:
	@echo "Usage: make up-[dev|stage|prod]"

up-dev:
	@$(MAKE) STACK=dev up-run

up-stage: create-networks
	@$(MAKE) STACK=stage up-run

up-prod: create-networks
	@$(MAKE) STACK=prod up-run

up-run:
	@echo ">>> Starting '$(STACK)' stack..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) up -d

down:
	@echo ">>> Stopping '$(STACK)' stack..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) down

start:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) start

stop:
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) stop

re:
	@echo ">>> Recreate '$(STACK)' stack from scratch..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) down --rmi all --volumes --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) up -d

list:
	docker ps

clean:
	@echo ">>> Clean '$(STACK)' stack and prune docker..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) down --rmi all --volumes --remove-orphans
	@docker system prune -f
	@docker volume prune -f
	@docker network prune -f

.PHONY: build up up-dev up-stage up-prod up-run down start stop re list clean
