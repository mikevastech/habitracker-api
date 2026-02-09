import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../prisma/app-prisma.service';
import { ITaskRepository } from '../../core/repositories/task.repository.interface';
import {
  TaskEntity,
  TaskType,
  PaginatedResult,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  HabitDirection as DomainHabitDirection,
  TaskPriority as DomainTaskPriority,
} from '../../core/entities/task.entity';
import {
  Prisma,
  TaskType as PrismaTaskType,
  HabitDirection as PrismaHabitDirection,
  TaskPriority as PrismaTaskPriority,
} from '@prisma/client';

type PrismaTaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    habitDetails: true;
    routineDetails: true;
    todoDetails: true;
    mindsetDetails: true;
  };
}>;

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: AppPrismaService) {}

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const data: Prisma.TaskCreateInput = {
      profile: { connect: { userId: task.userId! } },
      title: task.title!,
      type: task.taskType as PrismaTaskType, // Direktno mapiranje enuma
      isPublic: task.isPublic ?? false,
      category: task.categoryId ? { connect: { id: task.categoryId } } : undefined,
      frequency: task.frequencyId ? { connect: { id: task.frequencyId } } : undefined,
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
          endTime: task.endTime,
        },
      };
    } else if (task instanceof TodoEntity) {
      data.todoDetails = {
        create: {
          dueTime: task.dueTime,
          priority: task.priority as PrismaTaskPriority,
          isFlagged: task.isFlagged,
          url: task.url,
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
        habitDetails: true,
        routineDetails: true,
        todoDetails: true,
        mindsetDetails: true,
      },
    });

    return this.mapToEntity(created as PrismaTaskWithRelations);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        habitDetails: true,
        routineDetails: true,
        todoDetails: true,
        mindsetDetails: true,
      },
    });

    if (!task) return null;
    return this.mapToEntity(task as PrismaTaskWithRelations);
  }

  async findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResult<TaskEntity>> {
    const take = limit + 1;
    const tasks = await this.prisma.task.findMany({
      where: { userId, isDeleted: false },
      take: take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: {
        habitDetails: true,
        routineDetails: true,
        todoDetails: true,
        mindsetDetails: true,
      },
    });

    const hasNextPage = tasks.length > limit;
    const items = hasNextPage ? tasks.slice(0, limit) : tasks;
    const nextCursor = hasNextPage ? items[items.length - 1].id : undefined;

    return {
      data: items.map((t) => this.mapToEntity(t as PrismaTaskWithRelations)),
      nextCursor,
    };
  }

  async update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity> {
    const data: Prisma.TaskUpdateInput = {
      title: task.title,
      isPublic: task.isPublic,
      isDeleted: task.isDeleted,
      category: task.categoryId ? { connect: { id: task.categoryId } } : undefined,
    };

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
          endTime: task.endTime,
        },
      };
    } else if (task instanceof TodoEntity) {
      data.todoDetails = {
        update: {
          dueTime: task.dueTime,
          priority: task.priority as PrismaTaskPriority,
          isFlagged: task.isFlagged,
          url: task.url,
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
        habitDetails: true,
        routineDetails: true,
        todoDetails: true,
        mindsetDetails: true,
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

  private mapToEntity(prismaTask: PrismaTaskWithRelations): TaskEntity {
    const { habitDetails, routineDetails, todoDetails, mindsetDetails, ...rest } = prismaTask;
    const typeName = prismaTask.type as unknown as TaskType; // Cast na naš Domain Enum

    const baseData = {
      ...rest,
      taskType: typeName,
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
          endTime: routineDetails?.endTime ?? null,
        });
      case TaskType.TODO:
        return new TodoEntity({
          ...baseData,
          dueTime: todoDetails?.dueTime ?? null,
          priority:
            (todoDetails?.priority as unknown as DomainTaskPriority) ?? DomainTaskPriority.NONE,
          isFlagged: todoDetails?.isFlagged ?? false,
          url: todoDetails?.url ?? null,
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
