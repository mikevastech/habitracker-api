import { Injectable, Inject } from '@nestjs/common';
import { IGamificationRepository } from '../../domain/repositories/gamification.repository.interface';
import { IGamificationLocalDataSource } from '../data-sources/gamification.local.datasource.interface';
import { IGamificationRemoteDataSource } from '../data-sources/gamification.remote.datasource.interface';

@Injectable()
export class GamificationRepositoryImpl implements IGamificationRepository {
  constructor(
    @Inject(IGamificationLocalDataSource)
    private readonly local: IGamificationLocalDataSource,
    @Inject(IGamificationRemoteDataSource)
    private readonly remote: IGamificationRemoteDataSource,
  ) {}

  async listRewardEvents(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: import('../../domain/entities/gamification.entity').RewardEventEntity[]; nextCursor?: string }> {
    const cacheKey = `${userId}:lim${limit}:cur${cursor ?? 'start'}`;
    const cached = await this.local.getCachedRewardEvents(cacheKey);
    if (cached) return cached;
    const result = await this.remote.listRewardEvents(userId, limit, cursor);
    await this.local.setCachedRewardEvents(cacheKey, result, 120);
    return result;
  }

  async listAchievementDefinitions(): Promise<
    import('../../domain/entities/gamification.entity').AchievementDefinitionEntity[]
  > {
    const cached = await this.local.getCachedAchievementDefinitions();
    if (cached?.length) return cached;
    const result = await this.remote.listAchievementDefinitions();
    await this.local.setCachedAchievementDefinitions(result);
    return result;
  }

  async getUserAchievementProgress(
    userId: string,
  ): Promise<Map<string, { count: number; lastEarnedAt?: Date }>> {
    return this.remote.getUserAchievementProgress(userId);
  }
}
