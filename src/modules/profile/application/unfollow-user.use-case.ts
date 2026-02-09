import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    await this.profileRepository.unfollow(followerId, followingId);
  }
}
