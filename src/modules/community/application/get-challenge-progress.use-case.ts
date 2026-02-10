import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import type {
  ChallengeProgress,
} from '../domain/repositories/challenge.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetChallengeProgressParams {
  challengeId: string;
  userId: string;
}

@Injectable()
export class GetChallengeProgressUseCase
  implements IUseCase<ChallengeProgress, GetChallengeProgressParams>
{
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(params: GetChallengeProgressParams): Promise<ChallengeProgress> {
    const challenge = await this.challengeRepository.findById(params.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    const isMember = await this.challengeRepository.isMember(
      params.challengeId,
      params.userId,
    );
    if (!isMember) throw new NotFoundException('Not a member');
    const progress = await this.challengeRepository.getMemberProgress(
      params.challengeId,
      params.userId,
    );
    if (!progress) throw new NotFoundException('Progress not found');
    return progress;
  }
}
