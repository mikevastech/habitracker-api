import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupMemberEntity } from '../domain/entities/community.entity';

@Injectable()
export class ListGroupMembersUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(
    groupId: string,
    limit: number,
    cursor?: string,
    options?: { userId?: string },
  ): Promise<{ items: GroupMemberEntity[]; nextCursor?: string }> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (!group.isPublic && options?.userId) {
      const isMember = await this.groupRepository.isMember(groupId, options.userId);
      if (!isMember) throw new NotFoundException('Group not found');
    } else if (!group.isPublic) {
      throw new NotFoundException('Group not found');
    }
    return this.groupRepository.listMembers(groupId, limit, cursor);
  }
}
