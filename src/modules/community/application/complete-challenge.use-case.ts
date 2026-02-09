import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';

@Injectable()
export class CompleteChallengeUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(challengeId: string, userId: string): Promise<void> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can mark the challenge as completed');
    }
    await this.challengeRepository.markCompleted(challengeId, userId);
  }
}
