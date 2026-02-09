import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { ChallengeEntity } from '../domain/entities/community.entity';

@Injectable()
export class GetChallengeUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(
    challengeId: string,
    options?: { userId?: string },
  ): Promise<ChallengeEntity> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }
}
