import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { ChallengeEntity } from '../domain/entities/community.entity';

export class CreateChallengeDto {
  userId!: string;
  groupId!: string;
  @MinLength(1)
  @MaxLength(200)
  title!: string;
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;
  @IsOptional()
  @IsUrl()
  imageUrl?: string | null;
  taskTemplate?: unknown;
  @IsDateString()
  startDate!: string;
  @IsOptional()
  @IsDateString()
  endDate?: string | null;
  @IsOptional()
  @IsNumber()
  @Min(1)
  onTrackStreakThreshold?: number;
}

@Injectable()
export class CreateChallengeUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(dto: CreateChallengeDto): Promise<ChallengeEntity> {
    const group = await this.groupRepository.findById(dto.groupId);
    if (!group) throw new NotFoundException('Group not found');
    const isMember = await this.groupRepository.isMember(dto.groupId, dto.userId);
    if (!isMember) throw new ForbiddenException('Must be a group member to create a challenge');
    return this.challengeRepository.create({
      groupId: dto.groupId,
      creatorId: dto.userId,
      title: dto.title,
      description: dto.description ?? null,
      imageUrl: dto.imageUrl ?? null,
      taskTemplate: dto.taskTemplate ?? undefined,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      onTrackStreakThreshold: dto.onTrackStreakThreshold ?? 3,
    });
  }
}
