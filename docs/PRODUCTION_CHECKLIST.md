# Production-Ready Checklist

Checklist za production deploy (npr. Cloud Run), skalabilnost i kontrolu troškova.

---

## Šta već imate

| Stavka | Status |
|--------|--------|
| CORS | Uključen iz `CORS_ALLOWED_ORIGINS` |
| Swagger (OpenAPI) | `/api/docs`, `/api/docs-json` |
| Rate limiting | `@nestjs/throttler` + **Redis storage** (global limit) |
| Validacija | `ValidationPipe` (whitelist, transform) |
| Domain greške → HTTP | `DomainExceptionFilter` |
| **Helmet** | Uključen u `main.ts` |
| **Health** | `GET /health` → `{ status: 'ok' }` |
| **Sentry** | Init u `main.ts` ako je `SENTRY_DSN` set; `SentryExceptionFilter` šalje sve izuzetke |
| **Request log u prod** | Method + path + status + duration (bez body) |
| **Graceful shutdown** | `app.enableShutdownHooks()` |

---

## Preporučena lista (prioritet + troškovi)

### Security — visok prioritet

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **Helmet** | Besplatno | HTTP security headers. Dodaj `helmet()` na Express. |
| **CORS** | Besplatno | Već imate. |
| **Rate limit** | Besplatno | Throttler već uključen. In-memory = limit po Cloud Run instanci; za stvarno globalni limit koristi `ThrottlerStorage` sa Redis (imate Redis). |

### Dokumentacija — visok

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **@nestjs/swagger** | Besplatno | Već imate. Za Exit / frontend dovoljno. |

### Logging — visok

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **Stdout logger** | Besplatno | Nest Logger piše u stdout; GCP Cloud Logging automatski hvata. Dovoljno za start. |
| **Pino (opciono)** | Besplatno | Bolji perf + JSON; koristi `nestjs-pino` ako želite strukturirane logove. |
| **Request log u prod** | Besplatno | Trenutno se loguje samo u dev. U prod uključi bar method + path + status + duration (bez body zbog GDPR). |

### Greške / monitoring — visok

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **Sentry** | Free tier (5k events/mes) | Obavezno za produkciju. Hvata neuhvaćene izuzetke i stack trace. |

### Uptime — visok

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **UptimeRobot / Better Stack** | Free tier | Ping na `/health` (ili `/`) svakih 5 min; alert na Telegram ako padne. |
| **Health endpoint** | Besplatno | `GET /health` → 200. Potreban za Cloud Run liveness i za uptime ping. |

### Testing — srednji prioritet

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **Unit: Auth** | Besplatno | Session, guards, use-case za login/logout. |
| **Unit: Payments** | Besplatno | Ako imate plaćanja. |
| **Integracija** | Besplatno | 1–2 kritična flow-a (npr. login → get profile, create task). |

### Deployment — srednji prioritet

| Rešenje | Trošak | Napomena |
|---------|--------|----------|
| **CI/CD (GitHub Actions → Cloud Run)** | Besplatno | Build, test, deploy na push. |
| **Graceful shutdown** | Besplatno | `enableShutdownHooks()` u Nest; Cloud Run daje SIGTERM. |

### Opciono (kasnije)

| Rešenje | Kada |
|---------|------|
| **Redis za Throttler** | Kad treba jedan globalni rate limit preko više instanci. |
| **Request ID** | Kad treba trace requesta kroz logove (middleware + log field). |
| **APM (npr. Sentry Performance)** | Kad želiš detaljnije performanse. |

---

## Troškovi (sažeto)

- **Besplatno:** Helmet, CORS, Throttler (in-memory), Swagger, stdout logging, Sentry free tier, UptimeRobot, health endpoint, CI/CD, unit/integration testovi.
- **Paying:** Sentry preko free tiera, više Cloud Run instanci, Redis (ako već imate – bez dodatka za Throttler storage dok ne zatreba).

---

## Redosled uvođenja

1. ~~**Odmah:** Health endpoint, Helmet, Sentry, request log u prod, graceful shutdown, Throttler Redis.~~ **Urađeno.**
2. **Pre go-live:** UptimeRobot / Better Stack na `GET /health` + Telegram alert.
3. **Po potrebi:** Pino (strukturirani log), više testova.
