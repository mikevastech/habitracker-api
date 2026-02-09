import { Inject, Injectable } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupEntity } from '../domain/entities/community.entity';

export interface CreateGroupDto {
  userId: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  profileImageUrl?: string | null;
  isPublic?: boolean;
  allowMemberInvites?: boolean;
}

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(dto: CreateGroupDto): Promise<GroupEntity> {
    return this.groupRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      coverImageUrl: dto.coverImageUrl ?? null,
      profileImageUrl: dto.profileImageUrl ?? null,
      isPublic: dto.isPublic ?? true,
      allowMemberInvites: dto.allowMemberInvites ?? true,
      creatorUserId: dto.userId,
    });
  }
}
