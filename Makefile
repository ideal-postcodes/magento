.DEFAULT_GOAL := help

## -- Container Launch --

## Bootstrap containers and compile magento internals
.PHONY: bootstrap
bootstrap: up init

## Initialise repository
.PHONY: init
init:
	docker-compose exec web dockerize -wait tcp://db:3306 -timeout 60m /usr/local/bin/install-magento

## Launch docker-compose as background daemon
.PHONY: up
up:
	docker-compose up -d

## -- Development Methods --

## Run magento upgrade
.PHONY: upgrade
upgrade:
	docker-compose exec web /usr/local/bin/upgrade-magento

## Deploy static content
.PHONY: static_deploy
static_deploy:
	docker-compose exec web /usr/local/bin/compile-magento

## Launch bash shell into magento container
.PHONY: shell
shell:
	docker-compose exec web bash

## Enable magento cache. Should be disabled to load extensions
.PHONY: cache-enable
cache-enable:
	docker-compose exec web /var/www/html/bin/magento cache:enable

## Disable magento cache
.PHONY: cache-disable
cache-disable:
	docker-compose exec web /var/www/html/bin/magento cache:disable

## Flush cache
.PHONY: cache-flush
cache-flush:
	docker-compose exec web /var/www/html/bin/magento cache:flush

## Tail logs
.PHONY: logs
logs:
	docker-compose logs -f

## Tail magento logs only
.PHONY: logs-magento
logs-magento:
	docker-compose logs -f web

## -- Misc --

## Update repository against origin/master
.PHONY: update
update:
	git fetch
	git merge --ff-only origin/master

## How to use this Makefile
.PHONY: help
help:
	@printf "Usage\n";

	@awk '{ \
			if ($$0 ~ /^.PHONY: [a-zA-Z\-\_0-9]+$$/) { \
				helpCommand = substr($$0, index($$0, ":") + 2); \
				if (helpMessage) { \
					printf "\033[36m%-20s\033[0m %s\n", \
						helpCommand, helpMessage; \
					helpMessage = ""; \
				} \
			} else if ($$0 ~ /^[a-zA-Z\-\_0-9.]+:/) { \
				helpCommand = substr($$0, 0, index($$0, ":")); \
				if (helpMessage) { \
					printf "\033[36m%-20s\033[0m %s\n", \
						helpCommand, helpMessage; \
					helpMessage = ""; \
				} \
			} else if ($$0 ~ /^##/) { \
				if (helpMessage) { \
					helpMessage = helpMessage"\n                     "substr($$0, 3); \
				} else { \
					helpMessage = substr($$0, 3); \
				} \
			} else { \
				if (helpMessage) { \
					print "\n                     "helpMessage"\n" \
				} \
				helpMessage = ""; \
			} \
		}' \
		$(MAKEFILE_LIST)
