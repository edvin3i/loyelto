STACK ?= stage
DOCKER_COMPOSE := docker compose
COMPOSE_FILES := \
	-f docker-compose.yml \
	-f infra/base.yml \
	-f infra/$(STACK).yml \
	$(if $(filter $(STACK),stage prod),-f infra/traefik.yml)

create-network:
	@docker network inspect tnet >/dev/null 2>&1 || \
		( echo ">>> Creating external network 'tnet'..."; docker network create tnet )

build:
	@echo "Building images for $(STACK)..."
	$(DOCKER_COMPOSE) $(COMPOSE_FILES) build

up:
	@echo "Usage: make up-[dev|stage|prod]"

up-dev:
	@$(MAKE) STACK=dev up-run

up-stage:
	@$(MAKE) STACK=stage up-run
	@$(MAKE) STACK=stage up-anchor

up-prod:
	@$(MAKE) STACK=prod up-run
	@$(MAKE) STACK=prod up-anchor

up-anchor:
	@$(MAKE) STACK=$(STACK) create-network
	@echo ">>> Pulling & (re)starting 'anchor' service for '$(STACK)'..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) pull anchor
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) up -d anchor


up-run: create-network
	@echo ">>> Starting '$(STACK)' stack..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) up -d

down-stage:
	@$(MAKE) STACK=stage down
	@$(MAKE) STACK=stage down-anchor

down-prod:
	@$(MAKE) STACK=prod down
	@$(MAKE) STACK=prod down-anchor

down-anchor:
	@echo ">>> PStopping 'anchor' service for '$(STACK)'..."
	@$(DOCKER_COMPOSE) $(COMPOSE_FILES) down anchor

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

.PHONY: build up up-dev up-stage up-prod up-anchor up-run down start stop re list clean
