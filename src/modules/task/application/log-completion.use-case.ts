import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import { TaskCompletionEntity } from '../domain/entities/task-completion.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import {
  NotFoundDomainError,
  ForbiddenDomainError,
} from '../../../shared/domain/errors/domain.exceptions';
import type { LogCompletionDto } from './dtos/log-completion.dto';

export interface LogCompletionParams {
  taskId: string;
  userId: string;
  dto: LogCompletionDto;
}

@Injectable()
export class LogCompletionUseCase implements IUseCase<TaskCompletionEntity, LogCompletionParams> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(params: LogCompletionParams): Promise<TaskCompletionEntity> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) throw new NotFoundDomainError('Task not found');
    if (task.userId !== params.userId)
      throw new ForbiddenDomainError('Not allowed to log completion for this task');

    return this.taskRepository.createCompletion(params.taskId, {
      value: params.dto.value,
      status: params.dto.status ?? null,
      notes: params.dto.notes ?? null,
      description: params.dto.description ?? null,
    });
  }
}
