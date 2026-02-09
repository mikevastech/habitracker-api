import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface INotificationLocalDataSource {
  getCachedList(key: string): Promise<{ items: NotificationEntity[]; nextCursor?: string } | null>;
  setCachedList(
    key: string,
    data: { items: NotificationEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void>;
  invalidateListForUser(receiverId: string): Promise<void>;
}

export const INotificationLocalDataSource = Symbol('INotificationLocalDataSource');
