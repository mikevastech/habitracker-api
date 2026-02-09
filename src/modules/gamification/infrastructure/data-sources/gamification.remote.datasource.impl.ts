import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import {
  AchievementDefinitionEntity,
  RewardEventEntity,
} from '../../domain/entities/gamification.entity';
import { IGamificationRemoteDataSource } from './gamification.remote.datasource.interface';

function toRewardEventEntity(row: {
  id: string;
  userId: string;
  achievementDefinitionId: string;
  pointsAwarded: number;
  sourceType: string | null;
  sourceId: string | null;
  title: string | null;
  createdAt: Date;
}): RewardEventEntity {
  return new RewardEventEntity({
    id: row.id,
    userId: row.userId,
    achievementDefinitionId: row.achievementDefinitionId,
    pointsAwarded: row.pointsAwarded,
    sourceType: row.sourceType,
    sourceId: row.sourceId,
    title: row.title,
    createdAt: row.createdAt,
  });
}

function toAchievementDefinitionEntity(row: {
  id: string;
  code: string;
  name: string;
  description: string | null;
  pointsDefault: number;
  isActive: boolean;
  sortOrder: number;
}): AchievementDefinitionEntity {
  return new AchievementDefinitionEntity({
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    pointsDefault: row.pointsDefault,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  });
}

@Injectable()
export class GamificationRemoteDataSourceImpl implements IGamificationRemoteDataSource {
  constructor(private prisma: AppPrismaService) {}

  async listRewardEvents(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: RewardEventEntity[]; nextCursor?: string }> {
    const take = limit + 1;
    const rows = await this.prisma.rewardEvent.findMany({
      where: { userId },
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
    });
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;
    return {
      items: items.map(toRewardEventEntity),
      nextCursor,
    };
  }

  async listAchievementDefinitions(): Promise<AchievementDefinitionEntity[]> {
    const rows = await this.prisma.achievementDefinition.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map(toAchievementDefinitionEntity);
  }

  async getUserAchievementProgress(
    userId: string,
  ): Promise<Map<string, { count: number; lastEarnedAt?: Date }>> {
    const rows = await this.prisma.rewardEvent.findMany({
      where: { userId },
      select: {
        achievementDefinitionId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const map = new Map<string, { count: number; lastEarnedAt?: Date }>();
    for (const row of rows) {
      const existing = map.get(row.achievementDefinitionId);
      if (!existing) {
        map.set(row.achievementDefinitionId, {
          count: 1,
          lastEarnedAt: row.createdAt,
        });
      } else {
        existing.count += 1;
      }
    }
    return map;
  }
}
