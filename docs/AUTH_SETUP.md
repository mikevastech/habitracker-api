# Auth setup (Better Auth)

Auth is **fully configured** in code. To run it, set these in `.env`:

## Required

| Variable | Description |
|--------|-------------|
| `BETTER_AUTH_SECRET` | Secret for signing (min 32 chars). Generate: `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL connection string (Prisma / Better Auth use it) |

## For production / email / social

| Variable | Description |
|--------|-------------|
| `BETTER_AUTH_URL` or `API_URL` | Base URL of the API (e.g. `https://api.example.com`). Default: `http://localhost:3000` |
| `SENDGRID_API_KEY` | SendGrid API key (magic link + verification emails) |
| `SENDGRID_FROM_EMAIL` | Sender email for SendGrid |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SENDGRID_DATA_RESIDENCY` | Optional: `eu` for EU data residency |

## What’s enabled

- **Magic link** – passwordless email sign-in (SendGrid)
- **Google sign-in** – OAuth
- **2FA** – two-factor plugin
- **Passkey** – WebAuthn / passkey plugin
- **Email verification** – SendGrid
- **Rate limiting** – Better Auth (production) + NestJS Throttler (API)
- **Post-signup hook** – creates `HabitProfile` for habitracker users

## Optional later

- **Apple sign-in** – add `apple: { clientId, clientSecret, ... }` to `socialProviders` in `auth.lib.ts` and set env vars.

## Client (Flutter / web)

Use the Better Auth client pointing at your API base URL (e.g. `https://api.example.com/auth`). All auth routes are under `/auth/*` (handled by `AuthController`).
