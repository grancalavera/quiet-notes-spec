#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo "=== quiet-notes teardown ==="

docker compose down
echo "[ok] Services stopped"

if [[ "${1:-}" == "--clean" ]]; then
  docker volume rm "$(basename "$REPO_ROOT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g')_pb_data" 2>/dev/null && \
    echo "[ok] PocketBase data volume removed" || \
    echo "[skip] No PocketBase data volume found"
fi

echo "=== Teardown complete ==="
