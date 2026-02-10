/**
 * Composable data-source ports. Implement only what the aggregate needs.
 * Methods throw domain exceptions or let infrastructure errors bubble.
 *
 * Naming: Port contract uses getEntity(entityId). Implementations (e.g. Prisma)
 * may keep domain-specific names like findById; the adapter implements getEntity
 * by delegating to findById.
 */

export interface IGetById<T> {
  getEntity(entityId: string): Promise<T | null>;
}

export interface IGetAll<T> {
  getAllEntities(): Promise<T[]>;
}

export interface ISave<T> {
  saveEntity(entity: T): Promise<T>;
}

export interface ISaveAll<T> {
  saveAllEntities(entities: T[]): Promise<number>;
}

/** Patch type is up to the aggregate (e.g. Partial<T> or a dedicated DTO). */
export interface IUpdateById<T, Patch = Partial<T>> {
  updateEntity(entityId: string, patch: Patch): Promise<number>;
}

export interface IDelete {
  deleteEntity(entityId: string): Promise<number>;
}

export interface IDeleteAll {
  deleteAllEntities(): Promise<number>;
}

/**
 * Optional: full CRUD port for simple entities. Prefer composing IGetById, ISave, etc.
 */
export interface IDataSource<T, Patch = Partial<T>>
  extends IGetById<T>,
    IGetAll<T>,
    ISave<T>,
    IUpdateById<T, Patch>,
    IDelete {}
