import { Inject, Injectable } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { CreateGroupDto } from './dtos/create-group.dto';

@Injectable()
export class CreateGroupUseCase implements IUseCase<GroupEntity, CreateGroupDto> {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: CreateGroupDto): Promise<GroupEntity> {
    return this.groupRepository.create({
      name: params.name,
      description: params.description ?? null,
      coverImageUrl: params.coverImageUrl ?? null,
      profileImageUrl: params.profileImageUrl ?? null,
      isPublic: params.isPublic ?? true,
      allowMemberInvites: params.allowMemberInvites ?? true,
      creatorUserId: params.userId,
    });
  }
}
