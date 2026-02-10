import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface UnfollowUserParams {
  followerId: string;
  followingId: string;
}

@Injectable()
export class UnfollowUserUseCase implements IUseCase<void, UnfollowUserParams> {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(params: UnfollowUserParams): Promise<void> {
    await this.profileRepository.unfollow(params.followerId, params.followingId);
  }
}
