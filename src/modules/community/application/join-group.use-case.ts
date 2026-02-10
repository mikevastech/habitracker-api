import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupMemberEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface JoinGroupParams {
  groupId: string;
  userId: string;
}

@Injectable()
export class JoinGroupUseCase implements IUseCase<GroupMemberEntity, JoinGroupParams> {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: JoinGroupParams): Promise<GroupMemberEntity> {
    const group = await this.groupRepository.findById(params.groupId);
    if (!group) throw new NotFoundException('Group not found');
    const already = await this.groupRepository.isMember(params.groupId, params.userId);
    if (already) throw new ConflictException('Already a member');
    return this.groupRepository.join(params.groupId, params.userId, 'MEMBER');
  }
}
