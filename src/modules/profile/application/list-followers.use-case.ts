import { Inject, Injectable } from '@nestjs/common';
import type { Paginated } from '../../../shared/domain/paginated.types';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import type { HabitProfileEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface ListFollowersParams {
  profileId: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListFollowersUseCase
  implements IUseCase<Paginated<HabitProfileEntity>, ListFollowersParams>
{
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(params: ListFollowersParams): Promise<Paginated<HabitProfileEntity>> {
    return this.profileRepository.getFollowers(
      params.profileId,
      params.limit,
      params.cursor,
    );
  }
}
