import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import { TaskCompletionEntity } from '../domain/entities/task-completion.entity';

export interface LogCompletionDto {
  value?: number;
  status?: string;
  notes?: string;
  description?: string;
}

@Injectable()
export class LogCompletionUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(
    taskId: string,
    userId: string,
    dto: LogCompletionDto,
  ): Promise<TaskCompletionEntity> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Not allowed to log completion for this task');

    return this.taskRepository.createCompletion(taskId, {
      value: dto.value,
      status: dto.status ?? null,
      notes: dto.notes ?? null,
      description: dto.description ?? null,
    });
  }
}
