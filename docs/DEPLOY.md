# Deploy – Habit Tracker API

## Requirements

- **Node.js** 20+
- **PostgreSQL** (for Prisma)
- **Redis** (cache, BullMQ, follow sets, feed)
- **Better Auth** (session, OAuth) – needs a public URL in production

## Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis host (e.g. `localhost` or Redis service host) |
| `REDIS_PORT` | Redis port (default `6379`) |
| `BETTER_AUTH_SECRET` | Secret for session signing (min 32 chars) |
| `BETTER_AUTH_URL` | Public API URL (e.g. `https://api.example.com`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |
| `SENDGRID_API_KEY` / `SENDGRID_FROM_EMAIL` | Email (optional) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins (e.g. `https://app.example.com`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image upload (optional) |
| `MIXPANEL_PROJECT_TOKEN` / `MIXPANEL_API_SECRET` | Analytics (optional) |

## Database (Prisma)

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations (dev: creates migration files)
npm run prisma:migrate

# Production: apply migrations only
npm run prisma:deploy

# Optional: seed categories, units, templates
npm run prisma:seed
```

## Redis

Redis is used for:

- Caching (tasks, profile, reference data, notifications, gamification)
- BullMQ (suggestions jobs)
- Follow graph (sets, counters) and feed (sorted sets)

Ensure Redis is running and reachable at `REDIS_HOST` / `REDIS_PORT`. No schema setup required.

## Docker Compose (dev)

Postgres i Redis u kontejnerima:

```bash
cd habit-tracker-api
docker compose up -d
```

`.env` za lokalni API (Postgres na portu **5436**, Redis na **6379**):

```env
DATABASE_URL=postgresql://user:password@localhost:5436/habit_tracker_db
REDIS_HOST=localhost
REDIS_PORT=6379
```

Zatim lokalno: `npm install`, `npx prisma migrate dev`, `npm run start:dev`.

**Ceo stack u Dockeru (API u dev režimu, hot reload):**

```bash
docker compose --profile dev up --build
```

- Servis `api` koristi `Dockerfile.dev`, mount-uje `./src` i `./prisma` (izmene koda se odmah vide).
- Prvi put pokreni migracije u kontejneru:  
  `docker compose --profile dev run --rm api npx prisma migrate deploy`  
  (ili kreiraj migracije lokalno pa ponovo `docker compose --profile dev up`).

API: `http://localhost:3000`, Swagger: `http://localhost:3000/api/docs`.

## Run

```bash
# Development
npm run start:dev

# Production build + run
npm run build
npm run start:prod
```

API listens on the port set in your Nest config (e.g. `process.env.PORT` or default 3000).

## Swagger

When the app is running, OpenAPI docs are at:

- **Swagger UI:** `http://<host>:<port>/api/docs`

## Optional: Mixpanel / analytics

If `MIXPANEL_PROJECT_TOKEN` is set, the app can send server-side events. Leave unset to disable.
