import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { FollowEntity } from '../domain/entities/profile.entity';

@Injectable()
export class FollowUserUseCase {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(followerId: string, followingId: string): Promise<FollowEntity> {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const target = await this.profileRepository.findByUserId(followingId);
    if (!target) throw new NotFoundException('Profile not found');
    return this.profileRepository.follow(followerId, followingId);
  }
}
