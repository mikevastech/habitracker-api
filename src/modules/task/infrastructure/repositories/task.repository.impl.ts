import { Injectable, Inject } from '@nestjs/common';
import {
  ITaskRepository,
  ListTasksFilters,
} from '../../domain/repositories/task.repository.interface';
import { TaskEntity, PaginatedResult } from '../../domain/entities/task.entity';
import { TaskCompletionEntity } from '../../domain/entities/task-completion.entity';
import { ITaskLocalDataSource } from '../data-sources/task.local.datasource.interface';
import { ITaskRemoteDataSource } from '../data-sources/task.remote.datasource.interface';

@Injectable()
export class TaskRepositoryImpl implements ITaskRepository {
  constructor(
    @Inject(ITaskLocalDataSource)
    private readonly localDataSource: ITaskLocalDataSource,
    @Inject(ITaskRemoteDataSource)
    private readonly remoteDataSource: ITaskRemoteDataSource,
  ) {}

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    return this.remoteDataSource.create(task);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const cached = await this.localDataSource.getCachedTask(id);
    if (cached) return cached;

    const task = await this.remoteDataSource.findById(id);
    if (task) {
      await this.localDataSource.setCachedTask(id, task);
    }
    return task;
  }

  async findByUserId(
    userId: string,
    limit: number,
    cursor?: string,
    filters?: ListTasksFilters,
  ): Promise<PaginatedResult<TaskEntity>> {
    return this.remoteDataSource.findByUserId(userId, limit, cursor, filters);
  }

  async update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity> {
    const updated = await this.remoteDataSource.update(id, task);
    await this.localDataSource.deleteCachedTask(id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.remoteDataSource.delete(id);
    await this.localDataSource.deleteCachedTask(id);
  }

  async createCompletion(
    taskId: string,
    data: Partial<TaskCompletionEntity>,
  ): Promise<TaskCompletionEntity> {
    const completion = await this.remoteDataSource.createCompletion(taskId, data);
    const dateKey = this.todayDateKey();
    await this.localDataSource.incrementCompletionsCount(taskId, dateKey);
    return completion;
  }

  async findCompletionsByTaskId(
    taskId: string,
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResult<TaskCompletionEntity>> {
    return this.remoteDataSource.findCompletionsByTaskId(taskId, limit, cursor);
  }

  private todayDateKey(): string {
    const now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  }
}
