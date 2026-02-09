import { NotificationEntity } from '../../domain/entities/notification.entity';

export interface INotificationRemoteDataSource {
  listByUserId(
    receiverId: string,
    limit: number,
    cursor?: string,
    options?: { unreadOnly?: boolean },
  ): Promise<{ items: NotificationEntity[]; nextCursor?: string }>;

  markRead(id: string, receiverId: string): Promise<void>;
  markAllRead(receiverId: string): Promise<void>;
}

export const INotificationRemoteDataSource = Symbol('INotificationRemoteDataSource');
