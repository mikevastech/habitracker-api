import { Inject, Injectable } from '@nestjs/common';
import { IGamificationRepository } from '../domain/repositories/gamification.repository.interface';
import { RewardEventEntity } from '../domain/entities/gamification.entity';

@Injectable()
export class ListRewardEventsUseCase {
  constructor(
    @Inject(IGamificationRepository)
    private readonly gamificationRepository: IGamificationRepository,
  ) {}

  async execute(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: RewardEventEntity[]; nextCursor?: string }> {
    return this.gamificationRepository.listRewardEvents(userId, limit, cursor);
  }
}
