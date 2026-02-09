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

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
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

  constructor(partial: Partial<TodoEntity>) {
    super(partial);
    Object.assign(this, partial);
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
