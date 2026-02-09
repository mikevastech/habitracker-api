import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import type { HabitProfileEntity } from '../domain/entities/profile.entity';

@Injectable()
export class ListFollowingUseCase {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }> {
    return this.profileRepository.getFollowing(profileId, limit, cursor);
  }
}
