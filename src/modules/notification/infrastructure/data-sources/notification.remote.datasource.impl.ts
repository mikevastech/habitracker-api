import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { INotificationRemoteDataSource } from './notification.remote.datasource.interface';

function toEntity(row: {
  id: string;
  receiverId: string;
  senderId: string;
  notificationTypeId: string;
  senderName: string;
  senderAvatar: string | null;
  title: string;
  body: string;
  data: unknown;
  isRead: boolean;
  createdAt: Date;
}): NotificationEntity {
  return new NotificationEntity({
    id: row.id,
    receiverId: row.receiverId,
    senderId: row.senderId,
    notificationTypeId: row.notificationTypeId,
    senderName: row.senderName,
    senderAvatar: row.senderAvatar,
    title: row.title,
    body: row.body,
    data: row.data ?? {},
    isRead: row.isRead,
    createdAt: row.createdAt,
  });
}

@Injectable()
export class NotificationRemoteDataSourceImpl implements INotificationRemoteDataSource {
  constructor(private prisma: AppPrismaService) {}

  async listByUserId(
    receiverId: string,
    limit: number,
    cursor?: string,
    options?: { unreadOnly?: boolean },
  ): Promise<{ items: NotificationEntity[]; nextCursor?: string }> {
    const take = limit + 1;
    const where: { receiverId: string; isRead?: boolean } = { receiverId };
    if (options?.unreadOnly) where.isRead = false;

    const rows = await this.prisma.notification.findMany({
      where,
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
    });

    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;
    return {
      items: items.map(toEntity),
      nextCursor,
    };
  }

  async markRead(id: string, receiverId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id, receiverId },
      data: { isRead: true },
    });
  }

  async markAllRead(receiverId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { receiverId },
      data: { isRead: true },
    });
  }
}
