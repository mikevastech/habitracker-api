import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '../../../shared/domain/paginated.types';
import {
  ITaskRepository,
  ListTasksFilters,
} from '../domain/repositories/task.repository.interface';
import type { TaskEntity } from '../domain/entities/task.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface ListTasksParams {
  userId: string;
  limit: number;
  cursor?: string;
  taskType?: ListTasksFilters['taskType'];
  includeDeleted?: boolean;
}

@Injectable()
export class ListTasksUseCase
  implements IUseCase<Paginated<TaskEntity>, ListTasksParams>
{
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(params: ListTasksParams): Promise<Paginated<TaskEntity>> {
    const filters: ListTasksFilters | undefined =
      params.taskType != null || params.includeDeleted === true
        ? {
            ...(params.taskType != null && { taskType: params.taskType }),
            ...(params.includeDeleted === true && { includeDeleted: true }),
          }
        : undefined;

    return this.taskRepository.findByUserId(
      params.userId,
      params.limit,
      params.cursor,
      filters,
    );
  }
}
