import type { Paginated } from '../../../../shared/domain/paginated.types';
import { TaskEntity, TaskType } from '../entities/task.entity';
import { TaskCompletionEntity } from '../entities/task-completion.entity';

export interface ListTasksFilters {
  taskType?: TaskType;
  includeDeleted?: boolean;
}

export interface ITaskRepository {
  create(task: Partial<TaskEntity>): Promise<TaskEntity>;
  findById(id: string): Promise<TaskEntity | null>;
  findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
    filters?: ListTasksFilters,
  ): Promise<Paginated<TaskEntity>>;
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
  ): Promise<Paginated<TaskCompletionEntity>>;
}

export const ITaskRepository = Symbol('ITaskRepository');
