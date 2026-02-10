import { Inject, Injectable } from '@nestjs/common';
import { IGamificationRepository } from '../domain/repositories/gamification.repository.interface';
import { AchievementDefinitionEntity } from '../domain/entities/gamification.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface AchievementProgressItem {
  definition: AchievementDefinitionEntity;
  count: number;
  lastEarnedAt?: Date;
}

export interface GetUserAchievementProgressParams {
  userId: string;
}

@Injectable()
export class GetUserAchievementProgressUseCase
  implements IUseCase<AchievementProgressItem[], GetUserAchievementProgressParams>
{
  constructor(
    @Inject(IGamificationRepository)
    private readonly gamificationRepository: IGamificationRepository,
  ) {}

  async execute(params: GetUserAchievementProgressParams): Promise<AchievementProgressItem[]> {
    const [definitions, progress] = await Promise.all([
      this.gamificationRepository.listAchievementDefinitions(),
      this.gamificationRepository.getUserAchievementProgress(params.userId),
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
