import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType, HabitDirection, TaskPriority } from '../../domain/entities/task.entity';

export class TaskReminderResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiPropertyOptional()
  time?: string;

  @ApiPropertyOptional()
  locationName?: string;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;

  @ApiPropertyOptional()
  message?: string;

  @ApiProperty()
  isEnabled!: boolean;
}

export class TodoSubtaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  isCompleted!: boolean;
}

export class TaskFrequencyResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty({ type: [Number] })
  daysOfWeek!: number[];

  @ApiPropertyOptional()
  dayOfMonth!: number | null;

  @ApiProperty()
  interval!: number;

  @ApiPropertyOptional()
  timesPerPeriod!: number | null;

  @ApiPropertyOptional()
  endDate!: Date | null;
}

export class PomodoroSettingsResponseDto {
  @ApiProperty()
  taskId!: string;

  @ApiProperty()
  focusDuration!: number;

  @ApiProperty()
  breakDuration!: number;

  @ApiProperty()
  longBreakDuration!: number;

  @ApiProperty()
  totalSessions!: number;

  @ApiProperty()
  isEnabled!: boolean;

  @ApiProperty()
  autoStartBreaks!: boolean;

  @ApiProperty()
  autoStartFocus!: boolean;
}

export class TaskResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional()
  categoryId!: string | null;

  @ApiPropertyOptional()
  challengeId!: string | null;

  @ApiPropertyOptional()
  frequencyId!: string | null;

  @ApiProperty()
  title!: string;

  @ApiProperty({ enum: TaskType })
  taskType!: TaskType;

  @ApiPropertyOptional()
  iconName!: string | null;

  @ApiPropertyOptional()
  colorValue!: number | null;

  @ApiPropertyOptional()
  imageUrl!: string | null;

  @ApiProperty()
  isPublic!: boolean;

  @ApiProperty()
  isDeleted!: boolean;

  @ApiProperty()
  isPredefined!: boolean;

  @ApiProperty()
  forkCount!: number;

  @ApiProperty()
  isForked!: boolean;

  @ApiPropertyOptional()
  originalTaskId!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional()
  deletedAt!: Date | null;

  @ApiProperty()
  startDate!: Date;

  @ApiPropertyOptional()
  endDate!: Date | null;

  @ApiProperty({ type: [String] })
  notes!: string[];

  @ApiProperty({ type: [TaskReminderResponseDto] })
  reminders!: TaskReminderResponseDto[];

  @ApiPropertyOptional({ type: TaskFrequencyResponseDto })
  frequency?: TaskFrequencyResponseDto;

  @ApiPropertyOptional({ type: PomodoroSettingsResponseDto })
  pomodoroSettings?: PomodoroSettingsResponseDto;

  @ApiPropertyOptional()
  goalValue?: number;

  @ApiPropertyOptional()
  currentValue?: number;

  @ApiPropertyOptional()
  unitId?: string | null;

  @ApiPropertyOptional({ enum: HabitDirection })
  direction?: HabitDirection;

  @ApiPropertyOptional({ type: [String] })
  steps?: string[];

  @ApiPropertyOptional()
  startTime?: string | null;

  @ApiPropertyOptional()
  dueTime?: Date | null;

  @ApiPropertyOptional({ enum: TaskPriority })
  priority?: TaskPriority;

  @ApiPropertyOptional()
  isFlagged?: boolean;

  @ApiPropertyOptional()
  url?: string | null;

  @ApiPropertyOptional({ type: [TodoSubtaskResponseDto] })
  subtasks?: TodoSubtaskResponseDto[];

  @ApiPropertyOptional()
  affirmation?: string | null;

  @ApiPropertyOptional()
  durationMinutes?: number | null;
}

export class TaskCompletionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  taskId!: string;

  @ApiProperty()
  completedAt!: Date;

  @ApiPropertyOptional()
  value!: number | null;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  notes!: string | null;

  @ApiPropertyOptional()
  description!: string | null;
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  items!: TaskResponseDto[];

  @ApiPropertyOptional()
  nextCursor?: string;
}

export class PaginatedCompletionsResponseDto {
  @ApiProperty({ type: [TaskCompletionResponseDto] })
  items!: TaskCompletionResponseDto[];

  @ApiPropertyOptional()
  nextCursor?: string;
}
