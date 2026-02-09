import type { TaskEntity } from '../../domain/entities/task.entity';

export interface ITaskLocalDataSource {
  getCachedTask(taskId: string): Promise<TaskEntity | null>;
  setCachedTask(taskId: string, task: TaskEntity): Promise<void>;
  deleteCachedTask(taskId: string): Promise<void>;

  /** Increment completions count for a task on a given date (e.g. "2025-02-05"). For stats without DB count. */
  incrementCompletionsCount(taskId: string, dateKey: string): Promise<number>;
  /** Get completions count for a task on a given date. */
  getCompletionsCount(taskId: string, dateKey: string): Promise<number>;
}

export const ITaskLocalDataSource = Symbol('ITaskLocalDataSource');
