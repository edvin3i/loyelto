# #!/bin/sh

set -e

echo "⚡️ Waiting for PostgreSQL on $DB_HOST:$DB_PORT..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 1
done
echo "✅ Database is up!"

echo "⚡️ Running Alembic migrations..."
PYTHONPATH=/app uv run alembic upgrade head

echo "🚀 Starting FastAPI app via Uvicorn..."
exec "$@"
