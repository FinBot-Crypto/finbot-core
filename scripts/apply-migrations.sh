#!/usr/bin/env bash
set -euo pipefail

DB_USER="${DB_USER:?DB_USER is required}"
DB_NAME="${DB_NAME:?DB_NAME is required}"

for migration in scripts/migrations/*.sql; do
  echo "Applying ${migration}"
  docker exec -i crypto-postgres psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB_NAME" < "$migration"
done

