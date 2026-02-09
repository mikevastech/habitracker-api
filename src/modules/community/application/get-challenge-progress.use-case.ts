import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import type { ChallengeProgress } from '../domain/repositories/challenge.repository.interface';

@Injectable()
export class GetChallengeProgressUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeProgress> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    const isMember = await this.challengeRepository.isMember(challengeId, userId);
    if (!isMember) throw new NotFoundException('Not a member');
    const progress = await this.challengeRepository.getMemberProgress(challengeId, userId);
    if (!progress) throw new NotFoundException('Progress not found');
    return progress;
  }
}
