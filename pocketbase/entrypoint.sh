#!/bin/sh
set -e

# Check if any admins exist in the database
# PocketBase stores admins in pb_data/data.db in the _admins table
if [ -f /pb/pb_data/data.db ]; then
  # Database exists, check if there are any admins
  ADMIN_COUNT=$(sqlite3 /pb/pb_data/data.db "SELECT COUNT(*) FROM _admins" 2>/dev/null || echo "0")

  if [ "$ADMIN_COUNT" = "0" ]; then
    echo "No admins found, creating superuser..."
    /pb/pocketbase superuser create "${PB_SUPERUSER_EMAIL}" "${PB_SUPERUSER_PASS}"
  else
    echo "Admin user(s) already exist, skipping superuser creation"
  fi
else
  # Database doesn't exist yet, create superuser
  echo "Initializing database and creating superuser..."
  /pb/pocketbase superuser create "${PB_SUPERUSER_EMAIL}" "${PB_SUPERUSER_PASS}"
fi

# Start PocketBase server
exec /pb/pocketbase serve --http=0.0.0.0:8090
