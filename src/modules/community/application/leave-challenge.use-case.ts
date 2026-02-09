import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';

@Injectable()
export class LeaveChallengeUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(challengeId: string, userId: string): Promise<void> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    const isMember = await this.challengeRepository.isMember(challengeId, userId);
    if (!isMember) throw new NotFoundException('Not a member');
    await this.challengeRepository.leave(challengeId, userId);
  }
}
