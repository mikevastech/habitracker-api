import {
  AchievementDefinitionEntity,
  RewardEventEntity,
} from '../entities/gamification.entity';

export interface IGamificationRepository {
  listRewardEvents(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: RewardEventEntity[]; nextCursor?: string }>;

  listAchievementDefinitions(): Promise<AchievementDefinitionEntity[]>;

  /** User progress: achievement definition id -> count of times earned (RewardEvents). */
  getUserAchievementProgress(
    userId: string,
  ): Promise<Map<string, { count: number; lastEarnedAt?: Date }>>;
}

export const IGamificationRepository = Symbol('IGamificationRepository');
