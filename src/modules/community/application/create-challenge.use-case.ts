import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { ChallengeEntity } from '../domain/entities/community.entity';

export interface CreateChallengeDto {
  userId: string;
  groupId: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  taskTemplate?: unknown;
  startDate: Date;
  endDate?: Date | null;
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
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
      onTrackStreakThreshold: dto.onTrackStreakThreshold ?? 3,
    });
  }
}
