import { Inject, Injectable } from '@nestjs/common';
import { IGamificationRepository } from '../domain/repositories/gamification.repository.interface';
import { AchievementDefinitionEntity } from '../domain/entities/gamification.entity';

@Injectable()
export class ListAchievementDefinitionsUseCase {
  constructor(
    @Inject(IGamificationRepository)
    private readonly gamificationRepository: IGamificationRepository,
  ) {}

  async execute(): Promise<AchievementDefinitionEntity[]> {
    return this.gamificationRepository.listAchievementDefinitions();
  }
}
