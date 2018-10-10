#!/usr/bin/env sh
set -e

docker build --pull -f .docker/Dockerfile -t edde-js:local .
docker-compose -f .docker/docker.local.yml up -d
docker exec -it edde-js ash
docker-compose -f .docker/docker.local.yml down --volume
