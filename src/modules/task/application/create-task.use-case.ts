import { Inject, Injectable } from '@nestjs/common';
import {
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  IsDate,
  IsArray,
} from 'class-validator';
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

export class CreateTaskDto {
  userId!: string;
  @MinLength(1)
  @MaxLength(200)
  title!: string;
  @IsEnum(TaskType)
  taskType!: TaskType;
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
  @IsString()
  @IsOptional()
  categoryId?: string;
  @IsString()
  @IsOptional()
  iconName?: string;
  @IsNumber()
  @IsOptional()
  colorValue?: number;
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @IsDate()
  @IsOptional()
  startDate?: Date;
  @IsDate()
  @IsOptional()
  endDate?: Date;
  @IsArray()
  @IsOptional()
  notes?: string[];

  // Habit
  @IsNumber()
  @IsOptional()
  goalValue?: number;
  @IsNumber()
  @IsOptional()
  currentValue?: number;
  @IsString()
  @IsOptional()
  unitId?: string;
  @IsString()
  @IsOptional()
  direction?: string;

  // Routine
  @IsArray()
  @IsOptional()
  steps?: string[];
  @IsString()
  @IsOptional()
  startTime?: string;

  // Todo
  @IsDate()
  @IsOptional()
  dueTime?: Date;
  @IsString()
  @IsOptional()
  priority?: string;
  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;
  @IsString()
  @IsOptional()
  url?: string;

  // Mindset
  @IsString()
  @IsOptional()
  affirmation?: string;
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

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
export class CreateTaskUseCase {
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
        throw new Error(`Unsupported task type: ${String(dto.taskType)}`);
    }

    return this.taskRepository.create(task);
  }
}
