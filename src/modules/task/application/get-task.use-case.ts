import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import type { TaskEntity } from '../domain/entities/task.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import {
  NotFoundDomainError,
  ForbiddenDomainError,
} from '../../../shared/domain/errors/domain.exceptions';

export interface GetTaskParams {
  taskId: string;
  userId: string;
}

@Injectable()
export class GetTaskUseCase implements IUseCase<TaskEntity, GetTaskParams> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(params: GetTaskParams): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) throw new NotFoundDomainError('Task not found');
    if (task.userId !== params.userId)
      throw new ForbiddenDomainError('Not allowed to access this task');
    return task;
  }
}
