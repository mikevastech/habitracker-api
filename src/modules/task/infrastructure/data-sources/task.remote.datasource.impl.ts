import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import { ITaskRemoteDataSource } from './task.remote.datasource.interface';
import type { ListTasksFilters } from '../../domain/repositories/task.repository.interface';
import type { Paginated } from '../../../../shared/domain/paginated.types';
import {
  TaskEntity,
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  HabitDirection as DomainHabitDirection,
  TaskPriority as DomainTaskPriority,
  TaskReminder,
  TodoSubtask,
  TaskFrequency,
  PomodoroSettings,
} from '../../domain/entities/task.entity';
import { TaskCompletionEntity } from '../../domain/entities/task-completion.entity';
import {
  Prisma,
  TaskType as PrismaTaskType,
  HabitDirection as PrismaHabitDirection,
  TaskPriority as PrismaTaskPriority,
} from '@prisma/client';

type PrismaTaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    habitDetails: { include: { unit: true } };
    routineDetails: true;
    todoDetails: { include: { subtasks: true } };
    mindsetDetails: true;
    category: true;
    reminders: true;
    frequency: true;
    pomodoroSettings: true;
  };
}>;

@Injectable()
export class TaskRemoteDataSourceImpl implements ITaskRemoteDataSource {
  constructor(private readonly prisma: AppPrismaService) {}

  async getEntity(entityId: string): Promise<TaskEntity | null> {
    return this.findById(entityId);
  }

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const data: Prisma.TaskCreateInput = {
      profile: { connect: { userId: task.userId! } },
      title: task.title!,
      type: task.taskType as PrismaTaskType,
      isPublic: task.isPublic ?? false,
      isPredefined: task.isPredefined ?? false,
      iconName: task.iconName,
      colorValue: task.colorValue,
      imageUrl: task.imageUrl,
      notes: task.notes,
      startDate: task.startDate,
      endDate: task.endDate,
      challenge: task.challengeId ? { connect: { id: task.challengeId } } : undefined,
      category: task.categoryId ? { connect: { id: task.categoryId } } : undefined,
      frequency: task.frequency
        ? {
            create: {
              type: task.frequency.type,
              daysOfWeek: task.frequency.daysOfWeek,
              dayOfMonth: task.frequency.dayOfMonth,
              interval: task.frequency.interval,
              timesPerPeriod: task.frequency.timesPerPeriod,
              endDate: task.frequency.endDate,
            },
          }
        : task.frequencyId
          ? { connect: { id: task.frequencyId } }
          : undefined,
      reminders: {
        create: task.reminders?.map((r) => ({
          type: r.type,
          time: r.time,
          locationName: r.locationName,
          latitude: r.latitude,
          longitude: r.longitude,
          message: r.message,
          isEnabled: r.isEnabled,
        })),
      },
      pomodoroSettings: task.pomodoroSettings
        ? {
            create: {
              focusDuration: task.pomodoroSettings.focusDuration,
              breakDuration: task.pomodoroSettings.breakDuration,
              longBreakDuration: task.pomodoroSettings.longBreakDuration,
              totalSessions: task.pomodoroSettings.totalSessions,
              isEnabled: task.pomodoroSettings.isEnabled,
              autoStartBreaks: task.pomodoroSettings.autoStartBreaks,
              autoStartFocus: task.pomodoroSettings.autoStartFocus,
            },
          }
        : undefined,
    };

    if (task instanceof HabitEntity) {
      data.habitDetails = {
        create: {
          goalValue: task.goalValue,
          currentValue: task.currentValue,
          unitId: task.unitId,
          direction: task.direction as PrismaHabitDirection,
        },
      };
    } else if (task instanceof RoutineEntity) {
      data.routineDetails = {
        create: {
          steps: task.steps,
          startTime: task.startTime,
        },
      };
    } else if (task instanceof TodoEntity) {
      data.todoDetails = {
        create: {
          dueTime: task.dueTime,
          priority: task.priority as PrismaTaskPriority,
          isFlagged: task.isFlagged,
          url: task.url,
          subtasks: {
            create: task.subtasks?.map((s) => ({
              title: s.title,
              isCompleted: s.isCompleted,
            })),
          },
        },
      };
    } else if (task instanceof MindsetEntity) {
      data.mindsetDetails = {
        create: {
          affirmation: task.affirmation,
          durationMinutes: task.durationMinutes,
        },
      };
    }

    const created = await this.prisma.task.create({
      data,
      include: {
        habitDetails: { include: { unit: true } },
        routineDetails: true,
        todoDetails: { include: { subtasks: true } },
        mindsetDetails: true,
        pomodoroSettings: true,
      },
    });

    return this.mapToEntity(created as PrismaTaskWithRelations);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const row = await this.prisma.task.findUnique({
      where: { id },
      include: {
        habitDetails: { include: { unit: true } },
        routineDetails: true,
        todoDetails: { include: { subtasks: true } },
        mindsetDetails: true,
        category: true,
        reminders: true,
        frequency: true,
        pomodoroSettings: true,
      },
    });

    if (!row) return null;
    return this.mapToEntity(row as PrismaTaskWithRelations);
  }

  async findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
    filters?: ListTasksFilters,
  ): Promise<Paginated<TaskEntity>> {
    const take = limit + 1;
    const where: {
      userId: string;
      isDeleted?: boolean;
      type?: (typeof PrismaTaskType)[keyof typeof PrismaTaskType];
    } = { userId };
    if (filters?.includeDeleted !== true) {
      where.isDeleted = false;
    }
    if (filters?.taskType != null) {
      where.type = filters.taskType as (typeof PrismaTaskType)[keyof typeof PrismaTaskType];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        habitDetails: { include: { unit: true } },
        routineDetails: true,
        todoDetails: { include: { subtasks: true } },
        mindsetDetails: true,
        category: true,
        reminders: true,
        frequency: true,
        pomodoroSettings: true,
      },
    });

    const hasNextPage = tasks.length > limit;
    const items = hasNextPage ? tasks.slice(0, limit) : tasks;
    const nextCursor = hasNextPage ? items[items.length - 1].id : undefined;

    return {
      items: items.map((t) => this.mapToEntity(t as PrismaTaskWithRelations)),
      nextCursor,
    };
  }

  async update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity> {
    const data: Prisma.TaskUpdateInput = {
      title: task.title,
      isPublic: task.isPublic,
      isDeleted: task.isDeleted,
      iconName: task.iconName,
      colorValue: task.colorValue,
      imageUrl: task.imageUrl,
      notes: task.notes,
      startDate: task.startDate,
      endDate: task.endDate,
      category: task.categoryId ? { connect: { id: task.categoryId } } : undefined,
    };

    if (task.reminders) {
      data.reminders = {
        deleteMany: {},
        create: task.reminders.map((r) => ({
          type: r.type,
          time: r.time,
          locationName: r.locationName,
          latitude: r.latitude,
          longitude: r.longitude,
          message: r.message,
          isEnabled: r.isEnabled,
        })),
      };
    }

    if (task.frequency) {
      data.frequency = {
        upsert: {
          create: {
            type: task.frequency.type,
            daysOfWeek: task.frequency.daysOfWeek,
            dayOfMonth: task.frequency.dayOfMonth,
            interval: task.frequency.interval,
            timesPerPeriod: task.frequency.timesPerPeriod,
            endDate: task.frequency.endDate,
          },
          update: {
            type: task.frequency.type,
            daysOfWeek: task.frequency.daysOfWeek,
            dayOfMonth: task.frequency.dayOfMonth,
            interval: task.frequency.interval,
            timesPerPeriod: task.frequency.timesPerPeriod,
            endDate: task.frequency.endDate,
          },
        },
      };
    }

    if (task.pomodoroSettings) {
      data.pomodoroSettings = {
        upsert: {
          create: {
            focusDuration: task.pomodoroSettings.focusDuration,
            breakDuration: task.pomodoroSettings.breakDuration,
            longBreakDuration: task.pomodoroSettings.longBreakDuration,
            totalSessions: task.pomodoroSettings.totalSessions,
            isEnabled: task.pomodoroSettings.isEnabled,
            autoStartBreaks: task.pomodoroSettings.autoStartBreaks,
            autoStartFocus: task.pomodoroSettings.autoStartFocus,
          },
          update: {
            focusDuration: task.pomodoroSettings.focusDuration,
            breakDuration: task.pomodoroSettings.breakDuration,
            longBreakDuration: task.pomodoroSettings.longBreakDuration,
            totalSessions: task.pomodoroSettings.totalSessions,
            isEnabled: task.pomodoroSettings.isEnabled,
            autoStartBreaks: task.pomodoroSettings.autoStartBreaks,
            autoStartFocus: task.pomodoroSettings.autoStartFocus,
          },
        },
      };
    }

    if (task instanceof HabitEntity) {
      data.habitDetails = {
        update: {
          goalValue: task.goalValue,
          currentValue: task.currentValue,
          unitId: task.unitId,
          direction: task.direction as PrismaHabitDirection,
        },
      };
    } else if (task instanceof RoutineEntity) {
      data.routineDetails = {
        update: {
          steps: task.steps,
          startTime: task.startTime,
        },
      };
    } else if (task instanceof TodoEntity) {
      data.todoDetails = {
        update: {
          dueTime: task.dueTime,
          priority: task.priority as PrismaTaskPriority,
          isFlagged: task.isFlagged,
          url: task.url,
          subtasks: task.subtasks
            ? {
                deleteMany: {},
                create: task.subtasks.map((s) => ({
                  title: s.title,
                  isCompleted: s.isCompleted,
                })),
              }
            : undefined,
        },
      };
    } else if (task instanceof MindsetEntity) {
      data.mindsetDetails = {
        update: {
          affirmation: task.affirmation,
          durationMinutes: task.durationMinutes,
        },
      };
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        habitDetails: { include: { unit: true } },
        routineDetails: true,
        todoDetails: { include: { subtasks: true } },
        mindsetDetails: true,
        category: true,
        reminders: true,
        frequency: true,
        pomodoroSettings: true,
      },
    });

    return this.mapToEntity(updated as PrismaTaskWithRelations);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async createCompletion(
    taskId: string,
    data: Partial<TaskCompletionEntity>,
  ): Promise<TaskCompletionEntity> {
    const row = await this.prisma.taskCompletion.create({
      data: {
        taskId,
        value: data.value,
        status: data.status ?? undefined,
        notes: data.notes ?? undefined,
        description: data.description ?? undefined,
      },
    });
    return new TaskCompletionEntity({
      id: row.id,
      taskId: row.taskId,
      completedAt: row.completedAt,
      value: row.value,
      status: row.status,
      notes: row.notes,
      description: row.description,
    });
  }

  async findCompletionsByTaskId(
    taskId: string,
    limit: number,
    cursor?: string,
  ): Promise<Paginated<TaskCompletionEntity>> {
    const take = limit + 1;
    const rows = await this.prisma.taskCompletion.findMany({
      where: { taskId },
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { completedAt: 'desc' },
    });

    const hasNextPage = rows.length > limit;
    const items = hasNextPage ? rows.slice(0, limit) : rows;
    const nextCursor = hasNextPage ? items[items.length - 1].id : undefined;

    return {
      items: items.map(
        (r) =>
          new TaskCompletionEntity({
            id: r.id,
            taskId: r.taskId,
            completedAt: r.completedAt,
            value: r.value,
            status: r.status,
            notes: r.notes,
            description: r.description,
          }),
      ),
      nextCursor,
    };
  }

  private mapToEntity(prismaTask: PrismaTaskWithRelations): TaskEntity {
    const {
      habitDetails,
      routineDetails,
      todoDetails,
      mindsetDetails,
      reminders,
      frequency,
      pomodoroSettings,
      ...rest
    } = prismaTask;
    const typeName = prismaTask.type as unknown as TaskType;

    const baseData = {
      ...rest,
      taskType: typeName,
      reminders: reminders?.map((r: Record<string, any>) => new TaskReminder(r)) ?? [],
      frequency: frequency ? new TaskFrequency(frequency as Record<string, any>) : undefined,
      pomodoroSettings: pomodoroSettings
        ? new PomodoroSettings(pomodoroSettings as Record<string, any>)
        : undefined,
    };

    switch (typeName) {
      case TaskType.HABIT:
        return new HabitEntity({
          ...baseData,
          goalValue: habitDetails?.goalValue ?? 0,
          currentValue: habitDetails?.currentValue ?? 0,
          unitId: habitDetails?.unitId ?? null,
          direction:
            (habitDetails?.direction as unknown as DomainHabitDirection) ??
            DomainHabitDirection.POSITIVE,
        });
      case TaskType.ROUTINE:
        return new RoutineEntity({
          ...baseData,
          steps: routineDetails?.steps ?? [],
          startTime: routineDetails?.startTime ?? null,
        });
      case TaskType.TODO:
        return new TodoEntity({
          ...baseData,
          dueTime: todoDetails?.dueTime ?? null,
          priority:
            (todoDetails?.priority as unknown as DomainTaskPriority) ?? DomainTaskPriority.NONE,
          isFlagged: todoDetails?.isFlagged ?? false,
          url: todoDetails?.url ?? null,
          subtasks:
            todoDetails?.subtasks?.map((s: Record<string, any>) => new TodoSubtask(s)) ?? [],
        });
      case TaskType.MINDSET:
        return new MindsetEntity({
          ...baseData,
          affirmation: mindsetDetails?.affirmation ?? '',
          durationMinutes: mindsetDetails?.durationMinutes ?? null,
        });
      default:
        throw new Error(`Unknown task type: ${String(typeName)}`);
    }
  }
}
