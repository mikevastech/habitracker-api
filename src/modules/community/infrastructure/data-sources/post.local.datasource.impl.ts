import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { PostEntity } from '../../domain/entities/community.entity';
import { IPostLocalDataSource } from './post.local.datasource.interface';

const PREFIX_POST = 'post:';
const TTL_SECONDS = 300; // 5 min

@Injectable()
export class PostLocalDataSourceImpl implements IPostLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedPost(id: string): Promise<PostEntity | null> {
    const data = await this.redis.get(`${PREFIX_POST}${id}`);
    if (!data) return null;
    try {
      const plain = JSON.parse(data) as Partial<PostEntity> & {
        createdAt: string;
        updatedAt: string;
      };
      return new PostEntity({
        ...plain,
        createdAt: new Date(plain.createdAt),
        updatedAt: new Date(plain.updatedAt),
      });
    } catch {
      return null;
    }
  }

  async getCachedPosts(ids: string[]): Promise<(PostEntity | null)[]> {
    if (ids.length === 0) return [];
    const keys = ids.map((id) => `${PREFIX_POST}${id}`);
    const results = await this.redis.mget(...keys);

    return results.map((data) => {
      if (!data) return null;
      try {
        const plain = JSON.parse(data) as Partial<PostEntity> & {
          createdAt: string;
          updatedAt: string;
        };
        return new PostEntity({
          ...plain,
          createdAt: new Date(plain.createdAt),
          updatedAt: new Date(plain.updatedAt),
        });
      } catch {
        return null;
      }
    });
  }

  async setCachedPost(id: string, post: PostEntity): Promise<void> {
    await this.redis.set(`${PREFIX_POST}${id}`, JSON.stringify(post), 'EX', TTL_SECONDS);
  }

  async deleteCachedPost(id: string): Promise<void> {
    await this.redis.del(`${PREFIX_POST}${id}`);
  }

  async getCachedFeed(key: string): Promise<{ items: PostEntity[]; nextCursor?: string } | null> {
    const data = await this.redis.get(`feed:${key}`);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as {
        items: (Partial<PostEntity> & { createdAt: string; updatedAt: string })[];
        nextCursor?: string;
      };
      return {
        items: parsed.items.map(
          (item) =>
            new PostEntity({
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

  async setCachedFeed(
    key: string,
    data: { items: PostEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(`feed:${key}`, JSON.stringify(data), 'EX', ttlSeconds);
  }
}
