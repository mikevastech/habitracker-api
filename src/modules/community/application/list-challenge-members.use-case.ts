import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { ChallengeMemberEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';

export interface ListChallengeMembersParams {
  challengeId: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListChallengeMembersUseCase
  implements IUseCase<Paginated<ChallengeMemberEntity>, ListChallengeMembersParams>
{
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(params: ListChallengeMembersParams): Promise<Paginated<ChallengeMemberEntity>> {
    const challenge = await this.challengeRepository.findById(params.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    return this.challengeRepository.listMembers(
      params.challengeId,
      params.limit,
      params.cursor,
    );
  }
}
