import { TaskEntity, PaginatedResult } from '../entities/task.entity';

export interface ITaskRepository {
  create(task: Partial<TaskEntity>): Promise<TaskEntity>;
  findById(id: string): Promise<TaskEntity | null>;
  findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResult<TaskEntity>>;
  update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity>;
  delete(id: string): Promise<void>;
}

export const ITaskRepository = Symbol('ITaskRepository');
