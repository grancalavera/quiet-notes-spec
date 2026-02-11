#!/bin/sh
set -e

# Create superuser (ignore error if already exists)
/pb/pocketbase superuser create "${PB_SUPERUSER_EMAIL}" "${PB_SUPERUSER_PASS}" || true

# Start PocketBase server
exec /pb/pocketbase serve --http=0.0.0.0:8090
