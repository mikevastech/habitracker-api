import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { ITaskLocalDataSource } from './task.local.datasource.interface';
import type { TaskEntity } from '../../domain/entities/task.entity';
import {
  TaskType,
  HabitEntity,
  RoutineEntity,
  TodoEntity,
  MindsetEntity,
  HabitDirection,
  TaskPriority,
} from '../../domain/entities/task.entity';

const PREFIX_TASK = 'task:';
const PREFIX_COMPLETIONS_COUNT = 'task:completions:';
const TTL_TASK_SECONDS = 300; // 5 min

@Injectable()
export class TaskLocalDataSourceImpl implements ITaskLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedTask(taskId: string): Promise<TaskEntity | null> {
    const data = await this.redis.get(`${PREFIX_TASK}${taskId}`);
    if (!data) return null;
    try {
      const plain = JSON.parse(data) as unknown;
      return this.plainToTaskEntity(plain);
    } catch {
      return null;
    }
  }

  async setCachedTask(taskId: string, task: TaskEntity): Promise<void> {
    await this.redis.set(`${PREFIX_TASK}${taskId}`, JSON.stringify(task), 'EX', TTL_TASK_SECONDS);
  }

  async deleteCachedTask(taskId: string): Promise<void> {
    await this.redis.del(`${PREFIX_TASK}${taskId}`);
  }

  async incrementCompletionsCount(taskId: string, dateKey: string): Promise<number> {
    const key = `${PREFIX_COMPLETIONS_COUNT}${taskId}:${dateKey}`;
    const next = await this.redis.incr(key);
    if (next === 1) {
      await this.redis.expire(key, 86400 * 32); // keep ~32 days
    }
    return next;
  }

  async getCompletionsCount(taskId: string, dateKey: string): Promise<number> {
    const key = `${PREFIX_COMPLETIONS_COUNT}${taskId}:${dateKey}`;
    const val = await this.redis.get(key);
    return val ? parseInt(val, 10) || 0 : 0;
  }

  private plainToTaskEntity(plain: unknown): TaskEntity {
    const p = plain as Record<string, unknown> & { taskType: TaskType };
    if (!p || typeof p.taskType !== 'string') return this.defaultHabit();
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
        return this.defaultHabit();
    }
  }

  private defaultHabit(): HabitEntity {
    return new HabitEntity({
      taskType: TaskType.HABIT,
      goalValue: 0,
      currentValue: 0,
      unitId: null,
      direction: HabitDirection.POSITIVE,
    });
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
