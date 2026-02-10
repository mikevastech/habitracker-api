import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import {
  NotFoundDomainError,
  ForbiddenDomainError,
} from '../../../shared/domain/errors/domain.exceptions';

export interface DeleteTaskParams {
  taskId: string;
  userId: string;
}

@Injectable()
export class DeleteTaskUseCase implements IUseCase<void, DeleteTaskParams> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(params: DeleteTaskParams): Promise<void> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) throw new NotFoundDomainError('Task not found');
    if (task.userId !== params.userId)
      throw new ForbiddenDomainError('Not allowed to delete this task');
    await this.taskRepository.delete(params.taskId);
  }
}
