import { Inject, Injectable } from '@nestjs/common';
import { IGamificationRepository } from '../domain/repositories/gamification.repository.interface';
import { RewardEventEntity } from '../domain/entities/gamification.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';

export interface ListRewardEventsParams {
  userId: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListRewardEventsUseCase
  implements IUseCase<Paginated<RewardEventEntity>, ListRewardEventsParams>
{
  constructor(
    @Inject(IGamificationRepository)
    private readonly gamificationRepository: IGamificationRepository,
  ) {}

  async execute(params: ListRewardEventsParams): Promise<Paginated<RewardEventEntity>> {
    return this.gamificationRepository.listRewardEvents(
      params.userId,
      params.limit,
      params.cursor,
    );
  }
}
