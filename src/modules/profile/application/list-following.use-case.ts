import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '../../../shared/domain/paginated.types';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import type { HabitProfileEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface ListFollowingParams {
  profileId: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListFollowingUseCase
  implements IUseCase<Paginated<HabitProfileEntity>, ListFollowingParams>
{
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(params: ListFollowingParams): Promise<Paginated<HabitProfileEntity>> {
    return this.profileRepository.getFollowing(
      params.profileId,
      params.limit,
      params.cursor,
    );
  }
}
