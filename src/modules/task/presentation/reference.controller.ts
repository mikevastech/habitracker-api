import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { GetCategoriesUseCase } from '../application/get-categories.use-case';
import { GetUnitsUseCase } from '../application/get-units.use-case';
import {
  CreateCategoryUseCase,
  type CreateCategoryParams,
} from '../application/create-category.use-case';
import {
  CreateUnitUseCase,
  type CreateUnitParams,
} from '../application/create-unit.use-case';
import { GetTaskTemplatesUseCase } from '../application/get-task-templates.use-case';
import { NoParams } from '../../../shared/domain/ports/use-case.port';
import { CreateCategoryDto } from '../application/dtos/create-category.dto';
import { CreateUnitDto } from '../application/dtos/create-unit.dto';
import {
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
} from '../domain/entities/task.entity';
import type { CategoryEntity } from '../domain/entities/reference.entity';
import type { TaskTemplateItem } from '../domain/repositories/reference.repository.interface';
import {
  CategoryResponseDto,
  UnitResponseDto,
} from '../application/dtos/reference-response.dto';
import { TaskResponseDto } from '../application/dtos/task-response.dto';

@ApiTags('reference')
@Controller('reference')
export class ReferenceController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getUnitsUseCase: GetUnitsUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly createUnitUseCase: CreateUnitUseCase,
    private readonly getTaskTemplatesUseCase: GetTaskTemplatesUseCase,
  ) {}

  @Get('categories')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [CategoryResponseDto] })
  async getCategories(@CurrentUser() user: AuthenticatedUser) {
    return this.getCategoriesUseCase.execute({ userId: user.id });
  }

  @Get('units')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [UnitResponseDto] })
  async getUnits(@CurrentUser() user: AuthenticatedUser) {
    return this.getUnitsUseCase.execute({ userId: user.id });
  }

  @Post('categories')
  @UseGuards(SessionGuard)
  @ApiCreatedResponse({ type: CategoryResponseDto })
  async createCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateCategoryDto,
  ) {
    const params: CreateCategoryParams = {
      userId: user.id,
      data: {
        name: body.name,
        iconName: body.iconName ?? null,
        colorValue: body.colorValue ?? null,
        imageUrl: body.imageUrl ?? null,
      },
    };
    const category = await this.createCategoryUseCase.execute(params);
    return this.toCategoryDto(category);
  }

  @Post('units')
  @UseGuards(SessionGuard)
  @ApiCreatedResponse({ type: UnitResponseDto })
  async createUnit(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateUnitDto) {
    const params: CreateUnitParams = {
      userId: user.id,
      data: { name: body.name, symbol: body.symbol },
    };
    const unit = await this.createUnitUseCase.execute(params);
    return {
      id: unit.id,
      name: unit.name,
      symbol: unit.symbol,
      isPredefined: unit.isPredefined,
    };
  }

  @Get('task-templates')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: [TaskResponseDto] })
  async getTaskTemplates() {
    const items = await this.getTaskTemplatesUseCase.execute(new NoParams());
    return items.map((item) => this.toTaskTemplateResponse(item));
  }

  /** Serializes TaskTemplateItem to API shape (task + nested details + category). */
  private toTaskTemplateResponse(item: TaskTemplateItem) {
    const { task, category } = item;
    const reminderList = task.reminders ?? [];
    const freq = task.frequency;
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
      reminders: reminderList.map((r) => ({
        type: r.type,
        time: r.time,
        message: r.message,
        isEnabled: r.isEnabled,
      })),
      frequency: freq
        ? {
            type: freq.type,
            daysOfWeek: freq.daysOfWeek,
            dayOfMonth: freq.dayOfMonth,
            interval: freq.interval,
            timesPerPeriod: freq.timesPerPeriod,
            endDate: freq.endDate,
          }
        : null,
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
        const subtaskList = t.subtasks ?? [];
        return {
          ...base,
          todoDetails: {
            dueTime: t.dueTime,
            priority: t.priority,
            isFlagged: t.isFlagged,
            url: t.url,
            subtasks: subtaskList.map((s) => ({
              title: s.title,
              isCompleted: s.isCompleted,
            })),
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
  /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

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
