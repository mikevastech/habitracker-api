import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { ChallengeEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetChallengeParams {
  challengeId: string;
  userId?: string;
}

@Injectable()
export class GetChallengeUseCase implements IUseCase<ChallengeEntity, GetChallengeParams> {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(params: GetChallengeParams): Promise<ChallengeEntity> {
    const challenge = await this.challengeRepository.findById(params.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }
}
