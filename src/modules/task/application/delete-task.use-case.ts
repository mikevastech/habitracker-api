import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('Not allowed to delete this task');
    await this.taskRepository.delete(taskId);
  }
}
