import {
  AchievementDefinitionEntity,
  RewardEventEntity,
} from '../../domain/entities/gamification.entity';

export interface IGamificationRemoteDataSource {
  listRewardEvents(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: RewardEventEntity[]; nextCursor?: string }>;

  listAchievementDefinitions(): Promise<AchievementDefinitionEntity[]>;

  getUserAchievementProgress(
    userId: string,
  ): Promise<Map<string, { count: number; lastEarnedAt?: Date }>>;
}

export const IGamificationRemoteDataSource = Symbol('IGamificationRemoteDataSource');
