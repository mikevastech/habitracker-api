import {
  AchievementDefinitionEntity,
  RewardEventEntity,
} from '../../domain/entities/gamification.entity';

export interface IGamificationLocalDataSource {
  getCachedAchievementDefinitions(): Promise<AchievementDefinitionEntity[] | null>;
  setCachedAchievementDefinitions(items: AchievementDefinitionEntity[]): Promise<void>;

  getCachedRewardEvents(
    key: string,
  ): Promise<{ items: RewardEventEntity[]; nextCursor?: string } | null>;
  setCachedRewardEvents(
    key: string,
    data: { items: RewardEventEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void>;
}

export const IGamificationLocalDataSource = Symbol('IGamificationLocalDataSource');
