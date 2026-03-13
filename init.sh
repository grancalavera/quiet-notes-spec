#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo "=== quiet-notes bootstrap ==="

# 1. Git config: disable commit signing (no GPG/SSH key available in agent sessions)
git config commit.gpgsign false
echo "[ok] commit signing disabled"

# 2. Install dependencies
echo "--- Installing client dependencies..."
(cd "$REPO_ROOT/client" && pnpm install)
echo "[ok] client dependencies installed"

echo "--- Installing e2e dependencies..."
(cd "$REPO_ROOT/e2e" && pnpm install)
echo "[ok] e2e dependencies installed"

# 3. Verify Docker is available
if ! docker info > /dev/null 2>&1; then
  echo "[FAIL] Docker is not running. Start OrbStack/Docker and retry."
  exit 1
fi
echo "[ok] Docker is running"

# 4. Build and start services
echo "--- Building and starting services..."
docker compose up --build -d

# 5. Wait for PocketBase to be healthy
echo "--- Waiting for PocketBase..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:8090/api/health > /dev/null 2>&1; then
    echo "[ok] PocketBase is healthy"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "[FAIL] PocketBase did not become healthy within 30s"
    docker compose logs pocketbase
    exit 1
  fi
  sleep 1
done

# 6. Wait for Vite dev server
echo "--- Waiting for Vite dev server..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:5173 > /dev/null 2>&1; then
    echo "[ok] Vite dev server is running"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "[FAIL] Vite dev server did not start within 30s"
    docker compose logs client
    exit 1
  fi
  sleep 1
done

# 7. Smoke test: create and read an echo record
echo "--- Smoke test: echo round-trip..."
RESPONSE=$(curl -sf -X POST http://localhost:8090/api/collections/echoes/records \
  -H "Content-Type: application/json" \
  -d '{"message":"init-smoke-test"}')

if echo "$RESPONSE" | grep -q '"message":"init-smoke-test"'; then
  echo "[ok] Echo round-trip works"
  # Clean up smoke test record
  RECORD_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  curl -sf -X DELETE "http://localhost:8090/api/collections/echoes/records/$RECORD_ID" > /dev/null 2>&1 || true
else
  echo "[FAIL] Echo round-trip failed"
  echo "$RESPONSE"
  exit 1
fi

echo ""
echo "=== Bootstrap complete ==="
echo "  PocketBase: http://localhost:8090"
echo "  Client:     http://localhost:5173"
echo ""
