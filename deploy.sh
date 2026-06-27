#!/bin/bash
set -e

cp puzzfinder.caddy /etc/caddy/sites/puzzfinder.caddy
systemctl reload caddy
docker compose up -d --build
docker image prune -f
