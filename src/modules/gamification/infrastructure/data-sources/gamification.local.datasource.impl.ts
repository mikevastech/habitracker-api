import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import {
  AchievementDefinitionEntity,
  RewardEventEntity,
} from '../../domain/entities/gamification.entity';
import { IGamificationLocalDataSource } from './gamification.local.datasource.interface';

const KEY_ACHIEVEMENT_DEFINITIONS = 'gamification:achievement_definitions';
const PREFIX_REWARD_EVENTS = 'gamification:rewards:';
const TTL_ACHIEVEMENTS = 86400 * 7; // 7 days
const TTL_REWARDS = 120; // 2 min

@Injectable()
export class GamificationLocalDataSourceImpl implements IGamificationLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedAchievementDefinitions(): Promise<AchievementDefinitionEntity[] | null> {
    const data = await this.redis.get(KEY_ACHIEVEMENT_DEFINITIONS);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as AchievementDefinitionEntity[];
      return parsed.map((item) => new AchievementDefinitionEntity(item));
    } catch {
      return null;
    }
  }

  async setCachedAchievementDefinitions(
    items: AchievementDefinitionEntity[],
  ): Promise<void> {
    await this.redis.set(
      KEY_ACHIEVEMENT_DEFINITIONS,
      JSON.stringify(items),
      'EX',
      TTL_ACHIEVEMENTS,
    );
  }

  async getCachedRewardEvents(
    key: string,
  ): Promise<{ items: RewardEventEntity[]; nextCursor?: string } | null> {
    const data = await this.redis.get(`${PREFIX_REWARD_EVENTS}${key}`);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as {
        items: (Partial<RewardEventEntity> & { createdAt: string })[];
        nextCursor?: string;
      };
      return {
        items: parsed.items.map(
          (item) =>
            new RewardEventEntity({
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

  async setCachedRewardEvents(
    key: string,
    data: { items: RewardEventEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(
      `${PREFIX_REWARD_EVENTS}${key}`,
      JSON.stringify(data),
      'EX',
      ttlSeconds,
    );
  }
}
