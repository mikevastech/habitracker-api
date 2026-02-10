export enum TaskType {
  HABIT = 'HABIT',
  ROUTINE = 'ROUTINE',
  TODO = 'TODO',
  MINDSET = 'MINDSET',
}

export enum TaskPriority {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum HabitDirection {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export class TaskReminder {
  id!: string;
  type!: string;
  time?: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  message?: string;
  isEnabled!: boolean;

  constructor(partial: Partial<TaskReminder>) {
    Object.assign(this, partial);
  }
}

export class TodoSubtask {
  id!: string;
  title!: string;
  isCompleted!: boolean;

  constructor(partial: Partial<TodoSubtask>) {
    Object.assign(this, partial);
  }
}

export class TaskFrequency {
  id!: string;
  type!: string;
  daysOfWeek!: number[];
  dayOfMonth!: number | null;
  interval!: number;
  timesPerPeriod!: number | null;
  endDate!: Date | null;

  constructor(partial: Partial<TaskFrequency>) {
    Object.assign(this, partial);
  }
}

export class PomodoroSettings {
  taskId!: string;
  focusDuration!: number;
  breakDuration!: number;
  longBreakDuration!: number;
  totalSessions!: number;
  isEnabled!: boolean;
  autoStartBreaks!: boolean;
  autoStartFocus!: boolean;

  constructor(partial: Partial<PomodoroSettings>) {
    Object.assign(this, partial);
  }
}

export class TaskUnit {
  id!: string;
  name!: string;
  symbol!: string;
  isPredefined!: boolean;

  constructor(partial: Partial<TaskUnit>) {
    Object.assign(this, partial);
  }
}

export abstract class TaskEntity {
  id!: string;
  userId!: string; // References HabitProfile.userId
  categoryId!: string | null;
  challengeId!: string | null;
  frequencyId!: string | null;

  title!: string;
  taskType!: TaskType;
  iconName!: string | null;
  colorValue!: number | null;
  imageUrl!: string | null;

  isPublic!: boolean;
  isDeleted!: boolean;
  isPredefined!: boolean;

  forkCount!: number;
  isForked!: boolean;
  originalTaskId!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
  startDate!: Date;
  endDate!: Date | null;

  notes!: string[];
  reminders!: TaskReminder[];
  frequency?: TaskFrequency;
  pomodoroSettings?: PomodoroSettings;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
    if (!this.reminders) this.reminders = [];
  }
}

export class HabitEntity extends TaskEntity {
  override taskType = TaskType.HABIT;
  goalValue!: number;
  currentValue!: number;
  unitId!: string | null;
  direction!: HabitDirection;

  constructor(partial: Partial<HabitEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class RoutineEntity extends TaskEntity {
  override taskType = TaskType.ROUTINE;
  steps!: string[];
  startTime!: string | null; // e.g. "07:00"

  constructor(partial: Partial<RoutineEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class TodoEntity extends TaskEntity {
  override taskType = TaskType.TODO;
  dueTime!: Date | null;
  priority!: TaskPriority;
  isFlagged!: boolean;
  url!: string | null;
  subtasks!: TodoSubtask[];

  constructor(partial: Partial<TodoEntity>) {
    super(partial);
    Object.assign(this, partial);
    if (!this.subtasks) this.subtasks = [];
  }
}

export class MindsetEntity extends TaskEntity {
  override taskType = TaskType.MINDSET;
  affirmation!: string | null;
  durationMinutes!: number | null;

  constructor(partial: Partial<MindsetEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string;
}
