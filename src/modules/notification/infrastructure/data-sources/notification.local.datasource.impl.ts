import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { INotificationLocalDataSource } from './notification.local.datasource.interface';

const PREFIX_LIST = 'notification_list:';
const TTL_LIST = 60;

@Injectable()
export class NotificationLocalDataSourceImpl implements INotificationLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedList(
    key: string,
  ): Promise<{ items: NotificationEntity[]; nextCursor?: string } | null> {
    const data = await this.redis.get(`${PREFIX_LIST}${key}`);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as {
        items: (Partial<NotificationEntity> & { createdAt: string })[];
        nextCursor?: string;
      };
      return {
        items: parsed.items.map(
          (item) =>
            new NotificationEntity({
              ...item,
              createdAt: new Date(item.createdAt),
            }),
        ),
        nextCursor: parsed.nextCursor,
      };
    } catch {
      return null;
    }
  }

  async setCachedList(
    key: string,
    data: { items: NotificationEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(`${PREFIX_LIST}${key}`, JSON.stringify(data), 'EX', ttlSeconds);
  }

  async invalidateListForUser(receiverId: string): Promise<void> {
    const pattern = `${PREFIX_LIST}${receiverId}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) await this.redis.del(...keys);
  }
}
