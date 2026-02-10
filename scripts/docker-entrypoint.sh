#!/bin/sh
set -e

# Check if migrations need to be applied
echo "Checking migration status..."
MIGRATION_OUTPUT=$(npx prisma migrate status 2>&1) || MIGRATION_EXIT=$?

if [ -z "$MIGRATION_EXIT" ] && echo "$MIGRATION_OUTPUT" | grep -q "Database schema is up to date"; then
  echo "✓ Database schema is up to date, skipping migrations"
elif echo "$MIGRATION_OUTPUT" | grep -q "following migration have not yet been applied\|following migration have been applied but the database has been modified"; then
  echo "Applying pending migrations..."
  npx prisma migrate deploy
else
  # If migrate status fails (e.g., database doesn't exist or no migrations), try deploy anyway
  echo "Migration status check inconclusive, attempting to apply migrations..."
  npx prisma migrate deploy || echo "Migration deploy failed or no migrations to apply"
fi

# Start the application
exec "$@"
