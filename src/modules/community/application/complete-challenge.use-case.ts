import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface CompleteChallengeParams {
  challengeId: string;
  userId: string;
}

@Injectable()
export class CompleteChallengeUseCase implements IUseCase<void, CompleteChallengeParams> {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(params: CompleteChallengeParams): Promise<void> {
    const challenge = await this.challengeRepository.findById(params.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.creatorId !== params.userId) {
      throw new ForbiddenException('Only the creator can mark the challenge as completed');
    }
    await this.challengeRepository.markCompleted(params.challengeId, params.userId);
  }
}
