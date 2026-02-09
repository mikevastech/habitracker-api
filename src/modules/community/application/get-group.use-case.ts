import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupEntity } from '../domain/entities/community.entity';

@Injectable()
export class GetGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(
    groupId: string,
    options?: { requireMember?: boolean; userId?: string },
  ): Promise<GroupEntity> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (!group.isPublic && options?.requireMember && options?.userId) {
      const isMember = await this.groupRepository.isMember(groupId, options.userId);
      if (!isMember) throw new NotFoundException('Group not found');
    } else if (!group.isPublic && !options?.userId) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }
}
