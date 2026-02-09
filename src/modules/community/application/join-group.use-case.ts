import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupMemberEntity } from '../domain/entities/community.entity';

@Injectable()
export class JoinGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(groupId: string, userId: string): Promise<GroupMemberEntity> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    const already = await this.groupRepository.isMember(groupId, userId);
    if (already) throw new ConflictException('Already a member');
    return this.groupRepository.join(groupId, userId, 'MEMBER');
  }
}
