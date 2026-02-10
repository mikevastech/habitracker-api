# Repository vs DataSource

## Repository (domain port)

- **Role:** Domain contract for persistence. Defines *what* the application needs (e.g. `findByUserId`, `createCompletion`, `listPostsByGroup`).
- **Lives in:** Module’s **domain** or **application** layer (e.g. `task.repository.interface.ts`).
- **Used by:** Use-cases only. Controllers never depend on repositories.
- **Methods:** Domain-oriented, aggregate-specific. May return entities, paginated lists, or counts.

## DataSource (technical port)

- **Role:** Technical persistence contract. Describes low-level operations (get by id, save, update, delete) or a thin wrapper over a specific technology (Prisma, Redis, HTTP).
- **Lives in:** Module’s **infrastructure** layer (e.g. `task.remote.datasource.interface.ts`).
- **Implemented by:** Concrete adapters (Prisma, REST client, etc.).
- **Optional:** A module’s repository can *use* one or more data sources. When the repository’s needs map 1:1 to generic CRUD, the repository interface can extend shared ports from `shared/domain/ports/data-source.ports.ts` (e.g. `IGetById<TaskEntity>`). For richer domain operations, keep a custom repository interface and use data sources only as implementation details.

## When to use shared data-source ports

- Use `IGetById<T>`, `ISave<T>`, etc. when the aggregate only needs standard get/save/update/delete by id.
- Use a **custom repository** when you have domain methods (e.g. `findTasksByUserId`, `listCompletionsInRange`). The repository implementation can still call a data source that extends `IGetById` or other shared ports internally.
