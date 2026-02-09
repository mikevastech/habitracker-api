import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { ChallengeMemberEntity } from '../domain/entities/community.entity';

@Injectable()
export class ListChallengeMembersUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(
    challengeId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: ChallengeMemberEntity[]; nextCursor?: string }> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    return this.challengeRepository.listMembers(challengeId, limit, cursor);
  }
}
