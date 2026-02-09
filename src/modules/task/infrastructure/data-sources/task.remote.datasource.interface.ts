import { TaskEntity, PaginatedResult } from '../../domain/entities/task.entity';
import { TaskCompletionEntity } from '../../domain/entities/task-completion.entity';
import type { ListTasksFilters } from '../../domain/repositories/task.repository.interface';

export interface ITaskRemoteDataSource {
  create(task: Partial<TaskEntity>): Promise<TaskEntity>;
  findById(id: string): Promise<TaskEntity | null>;
  findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
    filters?: ListTasksFilters,
  ): Promise<PaginatedResult<TaskEntity>>;
  update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity>;
  delete(id: string): Promise<void>;

  createCompletion(
    taskId: string,
    data: Partial<TaskCompletionEntity>,
  ): Promise<TaskCompletionEntity>;
  findCompletionsByTaskId(
    taskId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResult<TaskCompletionEntity>>;
}

export const ITaskRemoteDataSource = Symbol('ITaskRemoteDataSource');
