# Clean Architecture – Project Structure Review

## Current Structure (per feature module)

```
modules/<feature>/
  domain/           # Entities + Ports (repository interfaces)
    entities/
    repositories/   # e.g. IProfileRepository
  application/      # Use cases
    *.use-case.ts
  infrastructure/   # Adapters (implementations)
    data-sources/   # optional: remote (Prisma), local (cache)
    repositories/   # e.g. ProfileRepositoryImpl
  presentation/     # Controllers
    *.controller.ts
  <feature>.module.ts
```

Shared cross-cutting code:

```
shared/domain/
  auth.types.ts   # AuthenticatedUser (kernel type for presentation)
shared/infrastructure/
  auth/       # SessionGuard, CurrentUser, auth.lib (better-auth)
  prisma/     # AppPrismaService, PrismaModule
  redis/      # RedisModule
```

Auth module now has full layers: `domain/ports` (IAuthHandler), `application` (HandleAuthUseCase), `infrastructure` (AuthHandlerAdapter), `presentation` (AuthController). Better-auth provides: magic link, Google sign-in, 2FA, passkey; rate limit in production. API rate limiting via `@nestjs/throttler` (global ThrottlerGuard).

---

## What’s good (aligned with Clean Architecture)

1. **Dependency rule**
   - **Domain** depends only on itself (entities + repository interfaces).
   - **Application** depends only on **domain** (and NestJS for DI); use cases use port interfaces, not concrete repositories.
   - **Infrastructure** implements ports and uses **domain** entities; repository impl composes data sources (remote/local).
   - **Presentation** depends on **application** (use cases) and on **shared/infrastructure** for auth; no direct dependency on Prisma or DB details.

2. **Ports and adapters**
   - Ports: `IProfileRepository`, `ITaskRepository` (and data-source interfaces inside infrastructure).
   - Adapters: `ProfileRepositoryImpl`, `ProfileRemoteDataSourceImpl`, `PrismaTaskRepository`, etc.

3. **Module boundaries**
   - Features are isolated (profile, task, auth); each has its own domain/application/infrastructure/presentation.

4. **Use cases**
   - Thin orchestration (e.g. `GetProfileUseCase` → repository), input/output expressed in domain or simple DTOs.

---

## Implemented refinements

- **Auth application layer**: `HandleAuthUseCase` + `IAuthHandler` port + `AuthHandlerAdapter`; controller no longer imports auth.lib.
- **Shared kernel**: `AuthenticatedUser` in `shared/domain/auth.types.ts`; guard maps better-auth session to it; presentation uses `AuthenticatedUser` instead of auth.lib `User`.
- **DTOs**: Remain next to use cases; move to `application/dto/` if they grow.

---

## Summary

- **Domain**: entities + repository (and optional port) interfaces only.
- **Application**: use cases depending only on domain ports and entities.
- **Infrastructure**: repository and data-source implementations, Prisma/Redis in shared.
- **Presentation**: controllers + guards/decorators, depending on use cases and shared auth.

The structure follows Clean Architecture and keeps dependencies pointing inward (presentation → application → domain; infrastructure → domain). No structural change is required; the items above are optional refinements.
