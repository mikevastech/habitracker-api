import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { FollowEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface FollowUserParams {
  followerId: string;
  followingId: string;
}

@Injectable()
export class FollowUserUseCase implements IUseCase<FollowEntity, FollowUserParams> {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(params: FollowUserParams): Promise<FollowEntity> {
    if (params.followerId === params.followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }
    const target = await this.profileRepository.findByUserId(params.followingId);
    if (!target) throw new NotFoundException('Profile not found');
    return this.profileRepository.follow(params.followerId, params.followingId);
  }
}
