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

@Injectable()
export class JoinChallengeUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(challengeId: string, userId: string): Promise<ChallengeMemberEntity> {
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.status !== 'ACTIVE') throw new ForbiddenException('Challenge is not active');
    const isGroupMember = await this.groupRepository.isMember(challenge.groupId, userId);
    if (!isGroupMember) throw new ForbiddenException('Must be a group member to join');
    const already = await this.challengeRepository.isMember(challengeId, userId);
    if (already) throw new ConflictException('Already a member');
    return this.challengeRepository.join(challengeId, userId);
  }
}
