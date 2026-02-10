import { Inject, Injectable } from '@nestjs/common';
import { IGamificationRepository } from '../domain/repositories/gamification.repository.interface';
import { AchievementDefinitionEntity } from '../domain/entities/gamification.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import { NoParams } from '../../../shared/domain/ports/use-case.port';

@Injectable()
export class ListAchievementDefinitionsUseCase
  implements IUseCase<AchievementDefinitionEntity[], NoParams>
{
  constructor(
    @Inject(IGamificationRepository)
    private readonly gamificationRepository: IGamificationRepository,
  ) {}

  async execute(_params: NoParams): Promise<AchievementDefinitionEntity[]> {
    return this.gamificationRepository.listAchievementDefinitions();
  }
}
