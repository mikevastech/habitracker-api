import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';

@Injectable()
export class LeaveGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(groupId: string, userId: string): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    const isMember = await this.groupRepository.isMember(groupId, userId);
    if (!isMember) throw new NotFoundException('Not a member');
    await this.groupRepository.leave(groupId, userId);
  }
}
