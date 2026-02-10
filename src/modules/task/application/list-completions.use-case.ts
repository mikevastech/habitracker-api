import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '../../../shared/domain/paginated.types';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import { TaskCompletionEntity } from '../domain/entities/task-completion.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import {
  NotFoundDomainError,
  ForbiddenDomainError,
} from '../../../shared/domain/errors/domain.exceptions';

export interface ListCompletionsParams {
  taskId: string;
  userId: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListCompletionsUseCase
  implements IUseCase<Paginated<TaskCompletionEntity>, ListCompletionsParams>
{
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(params: ListCompletionsParams): Promise<Paginated<TaskCompletionEntity>> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) throw new NotFoundDomainError('Task not found');
    if (task.userId !== params.userId)
      throw new ForbiddenDomainError('Not allowed to list completions for this task');

    return this.taskRepository.findCompletionsByTaskId(
      params.taskId,
      params.limit,
      params.cursor,
    );
  }
}
