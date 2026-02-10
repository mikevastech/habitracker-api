import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupMemberEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';

export interface ListGroupMembersParams {
  groupId: string;
  limit: number;
  cursor?: string;
  userId?: string;
}

@Injectable()
export class ListGroupMembersUseCase
  implements IUseCase<Paginated<GroupMemberEntity>, ListGroupMembersParams>
{
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: ListGroupMembersParams): Promise<Paginated<GroupMemberEntity>> {
    const group = await this.groupRepository.findById(params.groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (!group.isPublic && params.userId) {
      const isMember = await this.groupRepository.isMember(params.groupId, params.userId);
      if (!isMember) throw new NotFoundException('Group not found');
    } else if (!group.isPublic) {
      throw new NotFoundException('Group not found');
    }
    return this.groupRepository.listMembers(
      params.groupId,
      params.limit,
      params.cursor,
    );
  }
}
