import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import { PaginatedResult } from '../domain/entities/task.entity';
import { TaskCompletionEntity } from '../domain/entities/task-completion.entity';

@Injectable()
export class ListCompletionsUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(
    taskId: string,
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResult<TaskCompletionEntity>> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Not allowed to list completions for this task');

    return this.taskRepository.findCompletionsByTaskId(taskId, limit, cursor);
  }
}
