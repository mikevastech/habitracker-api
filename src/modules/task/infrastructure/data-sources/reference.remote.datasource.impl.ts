import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import { IReferenceRemoteDataSource } from './reference.remote.datasource.interface';
import { CategoryEntity, TaskUnitEntity } from '../../domain/entities/reference.entity';
import type { TaskTemplateItem } from '../../domain/repositories/reference.repository.interface';
import {
  TaskEntity,
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  HabitDirection as DomainHabitDirection,
  TaskPriority as DomainTaskPriority,
} from '../../domain/entities/task.entity';
import { Prisma } from '@prisma/client';

type PrismaTaskWithRelationsAndCategory = Prisma.TaskGetPayload<{
  include: {
    habitDetails: true;
    routineDetails: true;
    todoDetails: true;
    mindsetDetails: true;
    category: true;
  };
}>;

@Injectable()
export class ReferenceRemoteDataSourceImpl implements IReferenceRemoteDataSource {
  constructor(private readonly prisma: AppPrismaService) {}

  async findPredefinedCategories(): Promise<CategoryEntity[]> {
    const rows = await this.prisma.category.findMany({
      where: { isPredefined: true },
      orderBy: { name: 'asc' },
    });
    return rows.map(
      (r) =>
        new CategoryEntity({
          id: r.id,
          name: r.name,
          iconName: r.iconName,
          colorValue: r.colorValue,
          imageUrl: r.imageUrl,
          userId: r.userId,
          isPredefined: r.isPredefined,
        }),
    );
  }

  async findPredefinedUnits(): Promise<TaskUnitEntity[]> {
    const rows = await this.prisma.taskUnit.findMany({
      where: { isPredefined: true },
      orderBy: { name: 'asc' },
    });
    return rows.map(
      (r) =>
        new TaskUnitEntity({
          id: r.id,
          name: r.name,
          symbol: r.symbol,
          userId: r.userId,
          isPredefined: r.isPredefined,
        }),
    );
  }

  async findPredefinedTaskTemplates(): Promise<TaskTemplateItem[]> {
    const rows = await this.prisma.task.findMany({
      where: { isPredefined: true },
      include: {
        habitDetails: true,
        routineDetails: true,
        todoDetails: true,
        mindsetDetails: true,
        category: true,
      },
    });

    return rows.map((r) => ({
      task: this.mapTaskToEntity(r as unknown as PrismaTaskWithRelationsAndCategory),
      category: r.category
        ? new CategoryEntity({
            id: r.category.id,
            name: r.category.name,
            iconName: r.category.iconName,
            colorValue: r.category.colorValue,
            imageUrl: r.category.imageUrl,
            userId: r.category.userId,
            isPredefined: r.category.isPredefined,
          })
        : null,
    }));
  }

  private mapTaskToEntity(prismaTask: PrismaTaskWithRelationsAndCategory): TaskEntity {
    const {
      habitDetails,
      routineDetails,
      todoDetails,
      mindsetDetails,
      category: _cat,
      ...rest
    } = prismaTask;
    const typeName = prismaTask.type as unknown as TaskType;

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
          affirmation: mindsetDetails?.affirmation ?? null,
          durationMinutes: mindsetDetails?.durationMinutes ?? null,
        });
      default:
        return new HabitEntity({
          ...baseData,
          goalValue: 0,
          currentValue: 0,
          unitId: null,
          direction: DomainHabitDirection.POSITIVE,
        });
    }
  }
}
