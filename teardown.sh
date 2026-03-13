#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo "=== quiet-notes teardown ==="

if [[ "${1:-}" == "--clean" ]]; then
  docker compose down -v
  echo "[ok] Services stopped and volumes removed"
else
  docker compose down
  echo "[ok] Services stopped"
fi

echo "=== Teardown complete ==="
