import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { GetCategoriesUseCase } from '../application/get-categories.use-case';
import { GetUnitsUseCase } from '../application/get-units.use-case';
import { GetTaskTemplatesUseCase } from '../application/get-task-templates.use-case';
import {
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
} from '../domain/entities/task.entity';
import type { CategoryEntity } from '../domain/entities/reference.entity';
import type { TaskTemplateItem } from '../domain/repositories/reference.repository.interface';

@Controller('reference')
export class ReferenceController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getUnitsUseCase: GetUnitsUseCase,
    private readonly getTaskTemplatesUseCase: GetTaskTemplatesUseCase,
  ) {}

  @Get('categories')
  async getCategories() {
    return this.getCategoriesUseCase.execute();
  }

  @Get('units')
  async getUnits() {
    return this.getUnitsUseCase.execute();
  }

  @Get('task-templates')
  @UseGuards(SessionGuard)
  async getTaskTemplates() {
    const items = await this.getTaskTemplatesUseCase.execute();
    return items.map((item) => this.toTaskTemplateResponse(item));
  }

  /** Serializes TaskTemplateItem to API shape (task + nested details + category). */
  private toTaskTemplateResponse(item: TaskTemplateItem) {
    const { task, category } = item;
    const base = {
      id: task.id,
      userId: task.userId,
      categoryId: task.categoryId,
      type: task.taskType,
      title: task.title,
      iconName: task.iconName,
      colorValue: task.colorValue,
      imageUrl: task.imageUrl,
      isPublic: task.isPublic,
      isDeleted: task.isDeleted,
      isPredefined: task.isPredefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      startDate: task.startDate,
      endDate: task.endDate,
      category: category ? this.toCategoryDto(category) : null,
    };

    switch (task.taskType) {
      case TaskType.HABIT: {
        const t = task as HabitEntity;
        return {
          ...base,
          habitDetails: {
            goalValue: t.goalValue,
            currentValue: t.currentValue,
            unitId: t.unitId,
            direction: t.direction,
          },
        };
      }
      case TaskType.ROUTINE: {
        const t = task as RoutineEntity;
        return {
          ...base,
          routineDetails: {
            steps: t.steps,
            startTime: t.startTime,
          },
        };
      }
      case TaskType.TODO: {
        const t = task as TodoEntity;
        return {
          ...base,
          todoDetails: {
            dueTime: t.dueTime,
            priority: t.priority,
            isFlagged: t.isFlagged,
            url: t.url,
          },
        };
      }
      case TaskType.MINDSET: {
        const t = task as MindsetEntity;
        return {
          ...base,
          mindsetDetails: {
            affirmation: t.affirmation,
            durationMinutes: t.durationMinutes,
          },
        };
      }
      default:
        return base;
    }
  }

  private toCategoryDto(c: CategoryEntity) {
    return {
      id: c.id,
      name: c.name,
      iconName: c.iconName,
      colorValue: c.colorValue,
      imageUrl: c.imageUrl,
      isPredefined: c.isPredefined,
    };
  }
}
