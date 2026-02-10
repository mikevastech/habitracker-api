import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface LeaveGroupParams {
  groupId: string;
  userId: string;
}

@Injectable()
export class LeaveGroupUseCase implements IUseCase<void, LeaveGroupParams> {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: LeaveGroupParams): Promise<void> {
    const group = await this.groupRepository.findById(params.groupId);
    if (!group) throw new NotFoundException('Group not found');
    const isMember = await this.groupRepository.isMember(params.groupId, params.userId);
    if (!isMember) throw new NotFoundException('Not a member');
    await this.groupRepository.leave(params.groupId, params.userId);
  }
}
