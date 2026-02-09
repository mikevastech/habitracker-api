import { Inject, Injectable } from '@nestjs/common';
import { IGamificationRepository } from '../domain/repositories/gamification.repository.interface';
import { AchievementDefinitionEntity } from '../domain/entities/gamification.entity';

export interface AchievementProgressItem {
  definition: AchievementDefinitionEntity;
  count: number;
  lastEarnedAt?: Date;
}

@Injectable()
export class GetUserAchievementProgressUseCase {
  constructor(
    @Inject(IGamificationRepository)
    private readonly gamificationRepository: IGamificationRepository,
  ) {}

  async execute(userId: string): Promise<AchievementProgressItem[]> {
    const [definitions, progress] = await Promise.all([
      this.gamificationRepository.listAchievementDefinitions(),
      this.gamificationRepository.getUserAchievementProgress(userId),
    ]);
    return definitions.map((definition) => {
      const p = progress.get(definition.id);
      return {
        definition,
        count: p?.count ?? 0,
        lastEarnedAt: p?.lastEarnedAt,
      };
    });
  }
}
