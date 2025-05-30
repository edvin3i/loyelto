#!/bin/sh

set -e

echo "⚡️ Awaiting PostgreSQL on $DB_HOST:$DB_PORT..."
until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "⏳ Awaiting connection to DB..."
  sleep 1
done
echo "✅ DB is available!"

echo "🔍 Checking that DB is exists $POSTGRES_DB..."
DB_EXIST=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "$POSTGRES_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'")

if [ "$DB_EXIST" = "1" ]; then
  echo "✅ Database '$POSTGRES_DB' is exist already."
else
  echo "🛠 Database '$POSTGRES_DB' didn't find. Creating..."
  PGPASSWORD=$POSTGRES_PASSWORD createdb -h "$DB_HOST" -U "$POSTGRES_USER" "$POSTGRES_DB"
  echo "✅ Database '$POSTGRES_DB' is created."
fi


echo "⚡️ Apply Alembic migrations..."
# PYTHONPATH=/app uv run python -m alembic upgrade head

echo "🚀 Starting FastAPI over Uvicorn..."
exec "$@"
