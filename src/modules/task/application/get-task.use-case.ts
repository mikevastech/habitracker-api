import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import type { TaskEntity } from '../domain/entities/task.entity';

@Injectable()
export class GetTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, userId: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Not allowed to access this task');
    return task;
  }
}
