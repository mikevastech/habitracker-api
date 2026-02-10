import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetGroupParams {
  groupId: string;
  requireMember?: boolean;
  userId?: string;
}

@Injectable()
export class GetGroupUseCase implements IUseCase<GroupEntity, GetGroupParams> {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: GetGroupParams): Promise<GroupEntity> {
    const group = await this.groupRepository.findById(params.groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (!group.isPublic && params.requireMember && params.userId) {
      const isMember = await this.groupRepository.isMember(params.groupId, params.userId);
      if (!isMember) throw new NotFoundException('Group not found');
    } else if (!group.isPublic && !params.userId) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }
}
