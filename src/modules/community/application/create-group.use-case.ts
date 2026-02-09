import { Inject, Injectable } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { GroupEntity } from '../domain/entities/community.entity';

export class CreateGroupDto {
  userId!: string;
  @MinLength(1)
  @MaxLength(100)
  name!: string;
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string | null;
  @IsOptional()
  @IsUrl()
  profileImageUrl?: string | null;
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
  @IsOptional()
  @IsBoolean()
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
