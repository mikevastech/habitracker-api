import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
import {
  TaskEntity,
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  HabitDirection,
  TaskPriority,
  TaskReminder,
  TodoSubtask,
  TaskFrequency,
  PomodoroSettings,
} from '../domain/entities/task.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import { ValidationDomainError } from '../../../shared/domain/errors/domain.exceptions';
import type { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class CreateTaskUseCase implements IUseCase<TaskEntity, CreateTaskDto> {
  constructor(
    @Inject(ITaskRepository)
    private taskRepository: ITaskRepository,
  ) {}

  async execute(dto: CreateTaskDto): Promise<TaskEntity> {
    let task: TaskEntity;
    const baseData = {
      userId: dto.userId,
      title: dto.title,
      isPublic: dto.isPublic,
      categoryId: dto.categoryId,
      iconName: dto.iconName,
      colorValue: dto.colorValue,
      imageUrl: dto.imageUrl,
      startDate: dto.startDate,
      endDate: dto.endDate,
      notes: dto.notes,
      reminders: dto.reminders?.map((r: Record<string, any>) => new TaskReminder(r)) ?? [],
      frequency: dto.frequency ? new TaskFrequency(dto.frequency) : undefined,
      pomodoroSettings: dto.pomodoroSettings
        ? new PomodoroSettings(dto.pomodoroSettings)
        : undefined,
    };

    switch (dto.taskType) {
      case TaskType.HABIT:
        task = new HabitEntity({
          ...baseData,
          goalValue: dto.goalValue ?? 0,
          currentValue: dto.currentValue ?? 0,
          unitId: dto.unitId,
          direction: (dto.direction as HabitDirection) ?? HabitDirection.POSITIVE,
        });
        break;
      case TaskType.ROUTINE:
        task = new RoutineEntity({
          ...baseData,
          steps: dto.steps ?? [],
          startTime: dto.startTime,
        });
        break;
      case TaskType.TODO:
        task = new TodoEntity({
          ...baseData,
          dueTime: dto.dueTime,
          priority: (dto.priority as TaskPriority) ?? TaskPriority.NONE,
          isFlagged: dto.isFlagged ?? false,
          url: dto.url,
          subtasks: dto.subtasks?.map((s: Record<string, any>) => new TodoSubtask(s)) ?? [],
        });
        break;
      case TaskType.MINDSET:
        task = new MindsetEntity({
          ...baseData,
          affirmation: dto.affirmation ?? '',
          durationMinutes: dto.durationMinutes,
        });
        break;
      default:
        throw new ValidationDomainError(`Unsupported task type: ${String(dto.taskType)}`);
    }

    return this.taskRepository.create(task);
  }
}
