import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import {
  ChallengeEntity,
  ChallengeMemberEntity,
  ChallengeStatus,
} from '../../domain/entities/community.entity';
import { IChallengeRemoteDataSource } from './challenge.remote.datasource.interface';
import type {
  ChallengeProgress,
  ListChallengesOptions,
} from '../../domain/repositories/challenge.repository.interface';

function toChallengeEntity(row: {
  id: string;
  groupId: string;
  creatorId: string;
  title: string;
  description: string | null;
  status: string;
  imageUrl: string | null;
  taskTemplate: unknown;
  startDate: Date;
  endDate: Date | null;
  autoCreateTaskOnJoin: boolean;
  onTrackStreakThreshold: number;
  _count?: { members: number };
}): ChallengeEntity {
  return new ChallengeEntity({
    id: row.id,
    groupId: row.groupId,
    creatorId: row.creatorId,
    title: row.title,
    description: row.description,
    status: row.status as ChallengeStatus,
    imageUrl: row.imageUrl,
    taskTemplate: row.taskTemplate,
    startDate: row.startDate,
    endDate: row.endDate,
    autoCreateTaskOnJoin: row.autoCreateTaskOnJoin,
    onTrackStreakThreshold: row.onTrackStreakThreshold,
    memberCount: row._count?.members,
  });
}

function toMemberEntity(row: {
  challengeId: string;
  userId: string;
  currentStreak: number;
  joinedAt: Date;
}): ChallengeMemberEntity {
  return new ChallengeMemberEntity({
    challengeId: row.challengeId,
    userId: row.userId,
    currentStreak: row.currentStreak,
    joinedAt: row.joinedAt,
  });
}

@Injectable()
export class ChallengeRemoteDataSourceImpl implements IChallengeRemoteDataSource {
  constructor(private prisma: AppPrismaService) {}

  async create(
    data: Partial<ChallengeEntity> & { creatorId: string; groupId: string },
  ): Promise<ChallengeEntity> {
    const row = await this.prisma.challenge.create({
      data: {
        groupId: data.groupId,
        creatorId: data.creatorId,
        title: data.title!,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        taskTemplate: data.taskTemplate ?? undefined,
        startDate: data.startDate!,
        endDate: data.endDate ?? null,
        autoCreateTaskOnJoin: data.autoCreateTaskOnJoin ?? true,
        onTrackStreakThreshold: data.onTrackStreakThreshold ?? 3,
      },
      include: { _count: { select: { members: true } } },
    });
    return toChallengeEntity(row);
  }

  async findById(id: string): Promise<ChallengeEntity | null> {
    const row = await this.prisma.challenge.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    return row ? toChallengeEntity(row) : null;
  }

  async list(
    options: ListChallengesOptions,
  ): Promise<{ items: ChallengeEntity[]; nextCursor?: string }> {
    const { groupId, userId, limit, cursor } = options;
    const take = limit + 1;
    const where: { groupId?: string; members?: { some: { userId: string } } } = {};
    if (groupId) where.groupId = groupId;
    if (userId) where.members = { some: { userId } };

    const rows = await this.prisma.challenge.findMany({
      where,
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { startDate: 'desc' },
      include: { _count: { select: { members: true } } },
    });

    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;
    return { items: items.map(toChallengeEntity), nextCursor };
  }

  async addMember(challengeId: string, userId: string): Promise<ChallengeMemberEntity> {
    const member = await this.prisma.challengeMember.create({
      data: { challengeId, userId },
    });
    return toMemberEntity(member);
  }

  async removeMember(challengeId: string, userId: string): Promise<void> {
    await this.prisma.challengeMember.delete({
      where: {
        challengeId_userId: { challengeId, userId },
      },
    });
  }

  async isMember(challengeId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.challengeMember.count({
      where: { challengeId, userId },
    });
    return count > 0;
  }

  async listMembers(
    challengeId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: ChallengeMemberEntity[]; nextCursor?: string }> {
    const take = limit + 1;
    const rows = await this.prisma.challengeMember.findMany({
      where: { challengeId },
      take,
      cursor: cursor ? { challengeId_userId: { challengeId, userId: cursor } } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [{ joinedAt: 'asc' }],
    });
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].userId : undefined;
    return {
      items: items.map(toMemberEntity),
      nextCursor,
    };
  }

  async getMemberProgress(challengeId: string, userId: string): Promise<ChallengeProgress | null> {
    const [member, challenge] = await Promise.all([
      this.prisma.challengeMember.findUnique({
        where: { challengeId_userId: { challengeId, userId } },
      }),
      this.prisma.challenge.findUnique({
        where: { id: challengeId },
        select: { onTrackStreakThreshold: true },
      }),
    ]);
    if (!member || !challenge) return null;
    return {
      currentStreak: member.currentStreak,
      requiredStreak: challenge.onTrackStreakThreshold,
      onTrack: member.currentStreak >= challenge.onTrackStreakThreshold,
    };
  }

  async markCompleted(challengeId: string, completedByUserId: string): Promise<void> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { members: true },
    });
    if (!challenge || challenge.creatorId !== completedByUserId) return;
    if (challenge.status !== 'ACTIVE') return;

    const definition = await this.prisma.achievementDefinition.findUnique({
      where: { code: 'CHALLENGE_COMPLETED' },
    });
    if (!definition) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.challenge.update({
        where: { id: challengeId },
        data: { status: 'COMPLETED' },
      });
      for (const member of challenge.members) {
        await tx.rewardEvent.create({
          data: {
            userId: member.userId,
            achievementDefinitionId: definition.id,
            pointsAwarded: definition.pointsDefault,
            sourceType: 'CHALLENGE',
            sourceId: challengeId,
            title: definition.name,
          },
        });
        await tx.habitProfile.update({
          where: { userId: member.userId },
          data: { points: { increment: definition.pointsDefault } },
        });
      }
    });
  }
}
