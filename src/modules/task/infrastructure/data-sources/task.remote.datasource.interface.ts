import type { Paginated } from '../../../../shared/domain/paginated.types';
import { TaskEntity } from '../../domain/entities/task.entity';
import { TaskCompletionEntity } from '../../domain/entities/task-completion.entity';
import type { ListTasksFilters } from '../../domain/repositories/task.repository.interface';
import type { IGetById } from '../../../../shared/domain/ports/data-source.ports';

export interface ITaskRemoteDataSource extends IGetById<TaskEntity> {
  getEntity(entityId: string): Promise<TaskEntity | null>;
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

export const ITaskRemoteDataSource = Symbol('ITaskRemoteDataSource');
