import { Inject, Injectable } from '@nestjs/common';
import {
  ITaskRepository,
  ListTasksFilters,
} from '../domain/repositories/task.repository.interface';
import { PaginatedResult } from '../domain/entities/task.entity';
import type { TaskEntity } from '../domain/entities/task.entity';

export interface ListTasksDto {
  userId: string;
  limit: number;
  cursor?: string;
  taskType?: ListTasksFilters['taskType'];
  includeDeleted?: boolean;
}

@Injectable()
export class ListTasksUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(dto: ListTasksDto): Promise<PaginatedResult<TaskEntity>> {
    const filters: ListTasksFilters | undefined =
      dto.taskType != null || dto.includeDeleted === true
        ? {
            ...(dto.taskType != null && { taskType: dto.taskType }),
            ...(dto.includeDeleted === true && { includeDeleted: true }),
          }
        : undefined;

    return this.taskRepository.findByUserId(dto.userId, dto.limit, dto.cursor, filters);
  }
}
