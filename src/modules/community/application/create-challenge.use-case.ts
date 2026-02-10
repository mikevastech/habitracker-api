import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import { ChallengeEntity } from '../domain/entities/community.entity';
import type { CreateChallengeDto } from './dtos/create-challenge.dto';

@Injectable()
export class CreateChallengeUseCase implements IUseCase<ChallengeEntity, CreateChallengeDto> {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: CreateChallengeDto): Promise<ChallengeEntity> {
    const group = await this.groupRepository.findById(params.groupId);
    if (!group) throw new NotFoundException('Group not found');
    const isMember = await this.groupRepository.isMember(params.groupId, params.userId);
    if (!isMember) throw new ForbiddenException('Must be a group member to create a challenge');
    return this.challengeRepository.create({
      groupId: params.groupId,
      creatorId: params.userId,
      title: params.title,
      description: params.description ?? null,
      imageUrl: params.imageUrl ?? null,
      taskTemplate: params.taskTemplate ?? undefined,
      startDate: new Date(params.startDate),
      endDate: params.endDate ? new Date(params.endDate) : null,
      onTrackStreakThreshold: params.onTrackStreakThreshold ?? 3,
    });
  }
}
