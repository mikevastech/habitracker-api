import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { CategoryEntity, TaskUnitEntity } from '../../domain/entities/reference.entity';
import type { TaskTemplateItem } from '../../domain/repositories/reference.repository.interface';
import {
  TaskType,
  HabitDirection,
  TaskPriority,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  type TaskEntity,
} from '../../domain/entities/task.entity';
import { IReferenceLocalDataSource } from './reference.local.datasource.interface';

const KEY_CATEGORIES = 'reference:categories';
const KEY_UNITS = 'reference:units';
const KEY_TEMPLATES = 'reference:templates';
/** Predefined reference data rarely changes: 7 days */
const TTL_SECONDS = 604800;

@Injectable()
export class ReferenceLocalDataSourceImpl implements IReferenceLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedCategories(): Promise<CategoryEntity[] | null> {
    const data = await this.redis.get(KEY_CATEGORIES);
    if (!data) return null;
    const parsed = JSON.parse(data) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((p) => new CategoryEntity(p as Partial<CategoryEntity>));
  }

  async setCachedCategories(categories: CategoryEntity[]): Promise<void> {
    await this.redis.set(KEY_CATEGORIES, JSON.stringify(categories), 'EX', TTL_SECONDS);
  }

  async getCachedUnits(): Promise<TaskUnitEntity[] | null> {
    const data = await this.redis.get(KEY_UNITS);
    if (!data) return null;
    const parsed = JSON.parse(data) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((p) => new TaskUnitEntity(p as Partial<TaskUnitEntity>));
  }

  async setCachedUnits(units: TaskUnitEntity[]): Promise<void> {
    await this.redis.set(KEY_UNITS, JSON.stringify(units), 'EX', TTL_SECONDS);
  }

  async getCachedTaskTemplates(): Promise<TaskTemplateItem[] | null> {
    const data = await this.redis.get(KEY_TEMPLATES);
    if (!data) return null;
    const parsed = JSON.parse(data) as unknown;
    if (!Array.isArray(parsed)) return null;
    const items: TaskTemplateItem[] = parsed.map((item: { task: unknown; category: unknown }) => ({
      task: this.plainToTaskEntity(item.task),
      category:
        item.category != null ? new CategoryEntity(item.category as Partial<CategoryEntity>) : null,
    }));
    return items;
  }

  async setCachedTaskTemplates(templates: TaskTemplateItem[]): Promise<void> {
    await this.redis.set(KEY_TEMPLATES, JSON.stringify(templates), 'EX', TTL_SECONDS);
  }

  private plainToTaskEntity(plain: unknown): TaskEntity {
    const p = plain as Record<string, unknown> & { taskType: TaskType };
    if (!p || typeof p.taskType !== 'string') {
      return new HabitEntity({
        taskType: TaskType.HABIT,
        goalValue: 0,
        currentValue: 0,
        unitId: null,
        direction: HabitDirection.POSITIVE,
      });
    }
    const base = this.normalizeDateFields(p);
    const taskType = p.taskType;
    switch (taskType) {
      case TaskType.HABIT:
        return new HabitEntity({
          ...base,
          goalValue: typeof p.goalValue === 'number' ? p.goalValue : 0,
          currentValue: typeof p.currentValue === 'number' ? p.currentValue : 0,
          unitId: (p.unitId as string | null) ?? null,
          direction:
            p.direction === HabitDirection.NEGATIVE
              ? HabitDirection.NEGATIVE
              : HabitDirection.POSITIVE,
        });
      case TaskType.ROUTINE:
        return new RoutineEntity({
          ...base,
          steps: Array.isArray(p.steps) ? (p.steps as string[]) : [],
          startTime: (p.startTime as string | null) ?? null,
        });
      case TaskType.TODO:
        return new TodoEntity({
          ...base,
          dueTime: (base.dueTime as Date | null) ?? null,
          priority: (p.priority as TaskPriority) ?? TaskPriority.NONE,
          isFlagged: Boolean(p.isFlagged),
          url: (p.url as string | null) ?? null,
        });
      case TaskType.MINDSET:
        return new MindsetEntity({
          ...base,
          affirmation: (p.affirmation as string | null) ?? null,
          durationMinutes: typeof p.durationMinutes === 'number' ? p.durationMinutes : null,
        });
      default:
        return new HabitEntity({
          ...base,
          goalValue: 0,
          currentValue: 0,
          unitId: null,
          direction: HabitDirection.POSITIVE,
        });
    }
  }

  private normalizeDateFields(
    p: Record<string, unknown>,
  ): Record<string, unknown> & { dueTime?: Date | null } {
    const dateKeys = ['createdAt', 'updatedAt', 'deletedAt', 'startDate', 'endDate', 'dueTime'];
    const out = { ...p };
    for (const key of dateKeys) {
      const v = out[key];
      if (typeof v === 'string') {
        const d = new Date(v);
        (out as Record<string, unknown>)[key] = Number.isNaN(d.getTime()) ? null : d;
      }
    }
    return out as Record<string, unknown> & { dueTime?: Date | null };
  }
}
