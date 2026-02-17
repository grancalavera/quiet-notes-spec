#!/usr/bin/env bash
set -euo pipefail

echo "=== quiet-notes env check ==="

PASS=true

# PocketBase
if curl -sf http://localhost:8090/api/health > /dev/null 2>&1; then
  echo "[ok] PocketBase is healthy  → http://localhost:8090/_/"
else
  echo "[FAIL] PocketBase is not responding on :8090"
  PASS=false
fi

# Vite
if curl -sf http://localhost:5173 > /dev/null 2>&1; then
  echo "[ok] Vite dev server is running → http://localhost:5173/"
else
  echo "[FAIL] Vite dev server is not responding on :5173"
  PASS=false
fi

if [ "$PASS" = true ]; then
  echo ""
  echo "=== All services running ==="
else
  echo ""
  echo "=== Some services are down. Run ./init.sh to start them. ==="
  exit 1
fi
