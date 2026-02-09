import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { GroupEntity } from '../../domain/entities/community.entity';
import { IGroupLocalDataSource } from './group.local.datasource.interface';

const PREFIX_GROUP = 'group:';
const PREFIX_LIST = 'group_list:';
const TTL_GROUP = 300; // 5 min
const TTL_LIST = 60; // 1 min

@Injectable()
export class GroupLocalDataSourceImpl implements IGroupLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedGroup(id: string): Promise<GroupEntity | null> {
    const data = await this.redis.get(`${PREFIX_GROUP}${id}`);
    if (!data) return null;
    try {
      const plain = JSON.parse(data) as Partial<GroupEntity> & {
        createdAt: string;
        updatedAt: string;
      };
      return new GroupEntity({
        ...plain,
        createdAt: new Date(plain.createdAt),
        updatedAt: new Date(plain.updatedAt),
      });
    } catch {
      return null;
    }
  }

  async setCachedGroup(id: string, group: GroupEntity): Promise<void> {
    await this.redis.set(`${PREFIX_GROUP}${id}`, JSON.stringify(group), 'EX', TTL_GROUP);
  }

  async deleteCachedGroup(id: string): Promise<void> {
    await this.redis.del(`${PREFIX_GROUP}${id}`);
  }

  async getCachedList(key: string): Promise<{ items: GroupEntity[]; nextCursor?: string } | null> {
    const data = await this.redis.get(`${PREFIX_LIST}${key}`);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as {
        items: (Partial<GroupEntity> & { createdAt: string; updatedAt: string })[];
        nextCursor?: string;
      };
      return {
        items: parsed.items.map(
          (item) =>
            new GroupEntity({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
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
    data: { items: GroupEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(`${PREFIX_LIST}${key}`, JSON.stringify(data), 'EX', ttlSeconds);
  }
}
