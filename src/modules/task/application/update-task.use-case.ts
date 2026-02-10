import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../domain/repositories/task.repository.interface';
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

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsOptional()
  iconName?: string | null;

  @IsNumber()
  @IsOptional()
  colorValue?: number | null;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date | null;

  @IsArray()
  @IsOptional()
  notes?: string[];

  // type-specific (optional)
  @IsNumber()
  @IsOptional()
  goalValue?: number;

  @IsNumber()
  @IsOptional()
  currentValue?: number;

  @IsString()
  @IsOptional()
  unitId?: string | null;

  @IsString()
  @IsOptional()
  direction?: string;

  @IsArray()
  @IsOptional()
  steps?: string[];

  @IsString()
  @IsOptional()
  startTime?: string | null;

  @IsDate()
  @IsOptional()
  dueTime?: Date | null;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;

  @IsString()
  @IsOptional()
  url?: string | null;

  @IsString()
  @IsOptional()
  affirmation?: string | null;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number | null;

  @IsArray()
  @IsOptional()
  reminders?: any[];

  @IsArray()
  @IsOptional()
  subtasks?: any[];

  @IsOptional()
  frequency?: {
    type: string;
    daysOfWeek?: number[];
    dayOfMonth?: number | null;
    interval?: number;
    timesPerPeriod?: number;
    endDate?: Date;
  };

  @IsOptional()
  pomodoroSettings?: {
    focusDuration?: number;
    breakDuration?: number;
    longBreakDuration?: number;
    totalSessions?: number;
    isEnabled?: boolean;
    autoStartBreaks?: boolean;
    autoStartFocus?: boolean;
  };
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, userId: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const existing = await this.taskRepository.findById(taskId);
    if (!existing) throw new NotFoundException('Task not found');
    if (existing.userId !== userId) throw new ForbiddenException('Not allowed to update this task');

    const merged = this.merge(existing, dto);
    return this.taskRepository.update(taskId, merged);
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
