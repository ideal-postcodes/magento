PHP ?= 81
PLATFORM ?= $(shell uname -m)
YML_SUFFIX := $(if $(filter arm64,$(PLATFORM)),-arm64,)
.DEFAULT_GOAL := help
TAG=${git describe --tags}

## -- Container Launch --

## Launch docker compose as background daemon
.PHONY: up
up: build init

## Shut down docker compose services
.PHONY: down
down:
	docker compose -f docker-compose.yml -f docker/${PHP}${YML_SUFFIX}.yml down
## Build and run
.PHONY: build
build:
	docker compose -f docker-compose.yml -f docker/${PHP}${YML_SUFFIX}.yml up -d --wait

## Initialise repository - run install-magento
.PHONY: init
init:
	docker compose exec -T web dockerize -wait tcp://db:3306 -wait tcp://elasticsearch:9200 -timeout 60m /usr/local/bin/install-magento

## -- Development Methods --

## Run magento upgrade
.PHONY: upgrade
upgrade:
	docker compose exec web /usr/local/bin/upgrade-magento

## Deploy static content
.PHONY: static_deploy
static_deploy:
	docker compose exec web /usr/local/bin/compile-magento

## Launch bash shell into magento container
.PHONY: shell
shell:
	docker compose exec web bash

.PHONY: shell-db
shell-db:
	docker compose exec db bash

## Enable magento cache. Should be disabled to load extensions
.PHONY: cache-enable
cache-enable:
	docker compose exec web /var/www/html/bin/magento cache:enable

## Disable magento cache
.PHONY: cache-disable
cache-disable:
	docker compose exec web /var/www/html/bin/magento cache:disable

## Flush cache
.PHONY: cache-flush
cache-flush:
	docker compose exec -T web /var/www/html/bin/magento cache:flush

## Set base URL as 127.0.0.1 instead of localhost - fixes session expirey issue
.PHONY: set-base-url
set-base-url:
	docker compose exec -T db mysql -u magento -pmagento -D magento -e 'UPDATE `core_config_data` SET `value`="http://127.0.0.1:3000/" WHERE path="web/secure/base_url"'

## Fix for session expired error in development
.PHONY: fix-session-expire
fix-session-expire: set-base-url cache-flush

## Tail logs
.PHONY: logs
logs:
	docker compose logs -f

## Tail magento logs only
.PHONY: logs-magento
logs-magento:
	docker compose logs -f web

## -- Misc --

## Prepare a bundle for submission to Magento marketplace
.PHONY: bundle
bundle:
	zip -r idealpostcodes_magento-$$(git describe --tags --abbrev=0).zip . -x '.git/*' -x '.github/*' -x 'test/*' -x 'lib/*' -x 'node_modules/*' -x 'docker/*' -x '*.zip' -x '.gitignore' -x ".gitattributes"

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
