import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import {
  NotFoundDomainError,
  ForbiddenDomainError,
} from '../../../shared/domain/errors/domain.exceptions';
import {
  TaskEntity,
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  TaskReminder,
  TodoSubtask,
  TaskFrequency,
  PomodoroSettings,
} from '../domain/entities/task.entity';
import type { UpdateTaskDto } from './dtos/update-task.dto';

export interface UpdateTaskParams {
  taskId: string;
  userId: string;
  dto: UpdateTaskDto;
}

@Injectable()
export class UpdateTaskUseCase implements IUseCase<TaskEntity, UpdateTaskParams> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(params: UpdateTaskParams): Promise<TaskEntity> {
    const existing = await this.taskRepository.findById(params.taskId);
    if (!existing) throw new NotFoundDomainError('Task not found');
    if (existing.userId !== params.userId)
      throw new ForbiddenDomainError('Not allowed to update this task');

    const merged = this.merge(existing, params.dto);
    return this.taskRepository.update(params.taskId, merged);
  }

  private merge(existing: TaskEntity, dto: UpdateTaskDto): TaskEntity {
    const base = {
      ...existing,
      title: dto.title ?? existing.title,
      categoryId: dto.categoryId !== undefined ? dto.categoryId : existing.categoryId,
      iconName: dto.iconName !== undefined ? dto.iconName : existing.iconName,
      colorValue: dto.colorValue !== undefined ? dto.colorValue : existing.colorValue,
      imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : existing.imageUrl,
      isPublic: dto.isPublic !== undefined ? dto.isPublic : existing.isPublic,
      startDate: dto.startDate ?? existing.startDate,
      endDate: dto.endDate !== undefined ? dto.endDate : existing.endDate,
      notes: dto.notes ?? existing.notes,
      reminders:
        dto.reminders?.map((r: Record<string, any>) => new TaskReminder(r)) ?? existing.reminders,
      frequency: dto.frequency ? new TaskFrequency(dto.frequency) : existing.frequency,
      pomodoroSettings: dto.pomodoroSettings
        ? new PomodoroSettings(dto.pomodoroSettings)
        : existing.pomodoroSettings,
    };

    switch (existing.taskType) {
      case TaskType.HABIT: {
        const e = existing as HabitEntity;
        return new HabitEntity({
          ...base,
          goalValue: dto.goalValue ?? e.goalValue,
          currentValue: dto.currentValue ?? e.currentValue,
          unitId: dto.unitId !== undefined ? dto.unitId : e.unitId,
          direction: (dto.direction as HabitEntity['direction']) ?? e.direction,
        });
      }
      case TaskType.ROUTINE: {
        const e = existing as RoutineEntity;
        return new RoutineEntity({
          ...base,
          steps: dto.steps ?? e.steps,
          startTime: dto.startTime !== undefined ? dto.startTime : e.startTime,
        });
      }
      case TaskType.TODO: {
        const e = existing as TodoEntity;
        return new TodoEntity({
          ...base,
          dueTime: dto.dueTime !== undefined ? dto.dueTime : e.dueTime,
          priority: (dto.priority as TodoEntity['priority']) ?? e.priority,
          isFlagged: dto.isFlagged ?? e.isFlagged,
          url: dto.url !== undefined ? dto.url : e.url,
          subtasks: dto.subtasks?.map((s: Record<string, any>) => new TodoSubtask(s)) ?? e.subtasks,
        });
      }
      case TaskType.MINDSET: {
        const e = existing as MindsetEntity;
        return new MindsetEntity({
          ...base,
          affirmation: dto.affirmation !== undefined ? dto.affirmation : e.affirmation,
          durationMinutes:
            dto.durationMinutes !== undefined ? dto.durationMinutes : e.durationMinutes,
        });
      }
      default:
        return existing;
    }
  }
}
