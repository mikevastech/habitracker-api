import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { ChallengeEntity } from '../../domain/entities/community.entity';
import { IChallengeLocalDataSource } from './challenge.local.datasource.interface';

const PREFIX_CHALLENGE = 'challenge:';
const PREFIX_LIST = 'challenge_list:';
const TTL_CHALLENGE = 300;
const TTL_LIST = 60;

@Injectable()
export class ChallengeLocalDataSourceImpl implements IChallengeLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedChallenge(id: string): Promise<ChallengeEntity | null> {
    const data = await this.redis.get(`${PREFIX_CHALLENGE}${id}`);
    if (!data) return null;
    try {
      const plain = JSON.parse(data) as Partial<ChallengeEntity> & {
        startDate: string;
        endDate: string | null;
      };
      return new ChallengeEntity({
        ...plain,
        startDate: new Date(plain.startDate),
        endDate: plain.endDate ? new Date(plain.endDate) : null,
      });
    } catch {
      return null;
    }
  }

  async setCachedChallenge(id: string, challenge: ChallengeEntity): Promise<void> {
    await this.redis.set(
      `${PREFIX_CHALLENGE}${id}`,
      JSON.stringify(challenge),
      'EX',
      TTL_CHALLENGE,
    );
  }

  async deleteCachedChallenge(id: string): Promise<void> {
    await this.redis.del(`${PREFIX_CHALLENGE}${id}`);
  }

  async getCachedList(
    key: string,
  ): Promise<{ items: ChallengeEntity[]; nextCursor?: string } | null> {
    const data = await this.redis.get(`${PREFIX_LIST}${key}`);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as {
        items: (Partial<ChallengeEntity> & { startDate: string; endDate: string | null })[];
        nextCursor?: string;
      };
      return {
        items: parsed.items.map(
          (item) =>
            new ChallengeEntity({
              ...item,
              startDate: new Date(item.startDate),
              endDate: item.endDate ? new Date(item.endDate) : null,
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
    data: { items: ChallengeEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(`${PREFIX_LIST}${key}`, JSON.stringify(data), 'EX', ttlSeconds);
  }
}
