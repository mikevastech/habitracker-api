import {
  Inject,
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { ChallengeMemberEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface JoinChallengeParams {
  challengeId: string;
  userId: string;
}

@Injectable()
export class JoinChallengeUseCase implements IUseCase<ChallengeMemberEntity, JoinChallengeParams> {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: JoinChallengeParams): Promise<ChallengeMemberEntity> {
    const challenge = await this.challengeRepository.findById(params.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.status !== 'ACTIVE') throw new ForbiddenException('Challenge is not active');
    const isGroupMember = await this.groupRepository.isMember(challenge.groupId, params.userId);
    if (!isGroupMember) throw new ForbiddenException('Must be a group member to join');
    const already = await this.challengeRepository.isMember(params.challengeId, params.userId);
    if (already) throw new ConflictException('Already a member');
    return this.challengeRepository.join(params.challengeId, params.userId);
  }
}
