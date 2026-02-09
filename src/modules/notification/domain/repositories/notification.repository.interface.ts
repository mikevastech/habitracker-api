import { NotificationEntity } from '../entities/notification.entity';

export interface INotificationRepository {
  listByUserId(
    receiverId: string,
    limit: number,
    cursor?: string,
    options?: { unreadOnly?: boolean },
  ): Promise<{ items: NotificationEntity[]; nextCursor?: string }>;

  markRead(id: string, receiverId: string): Promise<void>;
  markAllRead(receiverId: string): Promise<void>;
}

export const INotificationRepository = Symbol('INotificationRepository');
