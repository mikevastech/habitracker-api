import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { INotificationLocalDataSource } from '../data-sources/notification.local.datasource.interface';
import { INotificationRemoteDataSource } from '../data-sources/notification.remote.datasource.interface';

const TTL_LIST = 60;

@Injectable()
export class NotificationRepositoryImpl implements INotificationRepository {
  constructor(
    @Inject(INotificationLocalDataSource)
    private readonly local: INotificationLocalDataSource,
    @Inject(INotificationRemoteDataSource)
    private readonly remote: INotificationRemoteDataSource,
  ) {}

  async listByUserId(
    receiverId: string,
    limit: number,
    cursor?: string,
    options?: { unreadOnly?: boolean },
  ): Promise<{ items: NotificationEntity[]; nextCursor?: string }> {
    const cacheKey = `${receiverId}:unread${options?.unreadOnly ?? false}:lim${limit}:cur${cursor ?? 'start'}`;
    const cached = await this.local.getCachedList(cacheKey);
    if (cached) return cached;
    const result = await this.remote.listByUserId(receiverId, limit, cursor, options);
    await this.local.setCachedList(cacheKey, result, TTL_LIST);
    return result;
  }

  async markRead(id: string, receiverId: string): Promise<void> {
    await this.remote.markRead(id, receiverId);
    await this.local.invalidateListForUser(receiverId);
  }

  async markAllRead(receiverId: string): Promise<void> {
    await this.remote.markAllRead(receiverId);
    await this.local.invalidateListForUser(receiverId);
  }
}
