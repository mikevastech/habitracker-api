import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface LeaveChallengeParams {
  challengeId: string;
  userId: string;
}

@Injectable()
export class LeaveChallengeUseCase implements IUseCase<void, LeaveChallengeParams> {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(params: LeaveChallengeParams): Promise<void> {
    const challenge = await this.challengeRepository.findById(params.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    const isMember = await this.challengeRepository.isMember(params.challengeId, params.userId);
    if (!isMember) throw new NotFoundException('Not a member');
    await this.challengeRepository.leave(params.challengeId, params.userId);
  }
}
