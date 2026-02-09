import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import {
  HabitProfileEntity,
  ProfileSettingsEntity,
  FollowEntity,
  SubscriptionTier,
  PostVisibility,
} from '../../domain/entities/profile.entity';
import { IProfileRemoteDataSource } from './profile.remote.datasource.interface';
import {
  SubscriptionTier as PrismaSubscriptionTier,
  PostVisibility as PrismaPostVisibility,
} from '@prisma/client';

function toEntity(row: {
  userId: string;
  username: string;
  subscriptionTier: PrismaSubscriptionTier;
  bio: string | null;
  points: number;
  isTaggingAllowed: boolean;
  _count: { followers: number; following: number };
  user?: { image: string | null };
}): HabitProfileEntity {
  return new HabitProfileEntity({
    userId: row.userId,
    username: row.username,
    subscriptionTier: row.subscriptionTier as unknown as SubscriptionTier,
    bio: row.bio,
    points: row.points,
    isTaggingAllowed: row.isTaggingAllowed,
    avatarUrl: row.user?.image ?? null,
    followerCount: row._count.followers,
    followingCount: row._count.following,
  });
}

@Injectable()
export class ProfileRemoteDataSourceImpl implements IProfileRemoteDataSource {
  constructor(private prisma: AppPrismaService) {}

  async findByUserId(userId: string): Promise<HabitProfileEntity | null> {
    const profile = await this.prisma.habitProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { image: true } },
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!profile) return null;
    return toEntity(profile);
  }

  async findByUsername(username: string): Promise<HabitProfileEntity | null> {
    const profile = await this.prisma.habitProfile.findUnique({
      where: { username },
      include: {
        user: { select: { image: true } },
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!profile) return null;
    return toEntity(profile);
  }

  async update(userId: string, data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity> {
    // If username is being updated, we check uniqueness (handled in use case or here)
    // If avatarUrl is being updated, we update the User model
    if (data.avatarUrl !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { image: data.avatarUrl },
      });
    }

    const updated = await this.prisma.habitProfile.update({
      where: { userId },
      data: {
        username: data.username,
        bio: data.bio,
        subscriptionTier: data.subscriptionTier
          ? (data.subscriptionTier as unknown as PrismaSubscriptionTier)
          : undefined,
        points: data.points,
        isTaggingAllowed: data.isTaggingAllowed,
      },
      include: {
        user: { select: { image: true } },
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    return toEntity(updated);
  }

  async create(data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity> {
    const created = await this.prisma.habitProfile.create({
      data: {
        userId: data.userId!,
        username: data.username!,
        subscriptionTier: data.subscriptionTier
          ? (data.subscriptionTier as unknown as PrismaSubscriptionTier)
          : 'FREE',
      },
      include: {
        user: { select: { image: true } },
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    return toEntity(created);
  }

  async getSettings(userId: string): Promise<ProfileSettingsEntity | null> {
    const row = await this.prisma.profileSettings.findUnique({
      where: { userId },
    });
    if (!row) return null;
    return this.settingsToEntity(row);
  }

  async updateSettings(
    userId: string,
    data: Partial<ProfileSettingsEntity>,
  ): Promise<ProfileSettingsEntity> {
    const updated = await this.prisma.profileSettings.update({
      where: { userId },
      data: {
        isSearchable: data.isSearchable,
        analyticsEnabled: data.analyticsEnabled,
        profileVisibility: data.profileVisibility as PrismaPostVisibility | undefined,
        challengeVisibility: data.challengeVisibility as PrismaPostVisibility | undefined,
        challengePostVisibility: data.challengePostVisibility as PrismaPostVisibility | undefined,
        taskDailyReminderTime: data.taskDailyReminderTime,
        taskWeekStartDay: data.taskWeekStartDay,
        taskArchiveVisible: data.taskArchiveVisible,
        pomodoroFocusDuration: data.pomodoroFocusDuration,
        pomodoroBreakDuration: data.pomodoroBreakDuration,
        pomodoroLongBreakDuration: data.pomodoroLongBreakDuration,
      },
    });
    return this.settingsToEntity(updated);
  }

  async createSettings(
    userId: string,
    data?: Partial<ProfileSettingsEntity>,
  ): Promise<ProfileSettingsEntity> {
    const defaults = {
      isSearchable: true,
      analyticsEnabled: true,
      profileVisibility: 'PUBLIC' as const,
      challengeVisibility: 'PUBLIC' as const,
      challengePostVisibility: 'PUBLIC' as const,
      taskWeekStartDay: 1,
      taskArchiveVisible: false,
      pomodoroFocusDuration: 25,
      pomodoroBreakDuration: 5,
      pomodoroLongBreakDuration: 15,
    };
    const created = await this.prisma.profileSettings.create({
      data: {
        userId,
        ...defaults,
        taskDailyReminderTime: data?.taskDailyReminderTime ?? null,
        isSearchable: data?.isSearchable ?? defaults.isSearchable,
        analyticsEnabled: data?.analyticsEnabled ?? defaults.analyticsEnabled,
        profileVisibility:
          (data?.profileVisibility as PrismaPostVisibility) ?? defaults.profileVisibility,
        challengeVisibility:
          (data?.challengeVisibility as PrismaPostVisibility) ?? defaults.challengeVisibility,
        challengePostVisibility:
          (data?.challengePostVisibility as PrismaPostVisibility) ??
          defaults.challengePostVisibility,
        taskWeekStartDay: data?.taskWeekStartDay ?? defaults.taskWeekStartDay,
        taskArchiveVisible: data?.taskArchiveVisible ?? defaults.taskArchiveVisible,
        pomodoroFocusDuration: data?.pomodoroFocusDuration ?? defaults.pomodoroFocusDuration,
        pomodoroBreakDuration: data?.pomodoroBreakDuration ?? defaults.pomodoroBreakDuration,
        pomodoroLongBreakDuration:
          data?.pomodoroLongBreakDuration ?? defaults.pomodoroLongBreakDuration,
      },
    });
    return this.settingsToEntity(created);
  }

  private settingsToEntity(row: {
    userId: string;
    isSearchable: boolean;
    analyticsEnabled: boolean;
    profileVisibility: string;
    challengeVisibility: string;
    challengePostVisibility: string;
    taskDailyReminderTime: string | null;
    taskWeekStartDay: number;
    taskArchiveVisible: boolean;
    pomodoroFocusDuration: number;
    pomodoroBreakDuration: number;
    pomodoroLongBreakDuration: number;
  }): ProfileSettingsEntity {
    return new ProfileSettingsEntity({
      userId: row.userId,
      isSearchable: row.isSearchable,
      analyticsEnabled: row.analyticsEnabled,
      profileVisibility: row.profileVisibility as PostVisibility,
      challengeVisibility: row.challengeVisibility as PostVisibility,
      challengePostVisibility: row.challengePostVisibility as PostVisibility,
      taskDailyReminderTime: row.taskDailyReminderTime,
      taskWeekStartDay: row.taskWeekStartDay,
      taskArchiveVisible: row.taskArchiveVisible,
      pomodoroFocusDuration: row.pomodoroFocusDuration,
      pomodoroBreakDuration: row.pomodoroBreakDuration,
      pomodoroLongBreakDuration: row.pomodoroLongBreakDuration,
    });
  }

  async follow(followerId: string, followingId: string): Promise<FollowEntity> {
    await this.prisma.follow.create({
      data: { followerId, followingId },
    });
    return new FollowEntity({ followerId, followingId });
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async getFollowers(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }> {
    const take = limit + 1;
    const rows = await this.prisma.follow.findMany({
      where: { followingId: profileId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor
        ? { followerId_followingId: { followerId: cursor, followingId: profileId } }
        : undefined,
      orderBy: [{ followerId: 'asc' }],
      include: {
        follower: {
          include: {
            user: { select: { image: true } },
            _count: { select: { followers: true, following: true } },
          },
        },
      },
    });
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].followerId : undefined;
    return {
      data: items.map((r) => toEntity(r.follower)),
      nextCursor,
    };
  }

  async getFollowing(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }> {
    const take = limit + 1;
    const rows = await this.prisma.follow.findMany({
      where: { followerId: profileId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor
        ? { followerId_followingId: { followerId: profileId, followingId: cursor } }
        : undefined,
      orderBy: [{ followingId: 'asc' }],
      include: {
        following: {
          include: {
            user: { select: { image: true } },
            _count: { select: { followers: true, following: true } },
          },
        },
      },
    });
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].followingId : undefined;
    return {
      data: items.map((r) => toEntity(r.following)),
      nextCursor,
    };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const row = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return row != null;
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.prisma.follow.count({
      where: { followingId: userId },
    });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.prisma.follow.count({
      where: { followerId: userId },
    });
  }

  async findManyByUserIds(userIds: string[]): Promise<HabitProfileEntity[]> {
    if (userIds.length === 0) return [];
    const unique = [...new Set(userIds)];
    const profiles = await this.prisma.habitProfile.findMany({
      where: { userId: { in: unique } },
      include: {
        user: { select: { image: true } },
        _count: { select: { followers: true, following: true } },
      },
    });
    return profiles.map((p) => toEntity(p));
  }

  async getTopUserIdsByFollowerCount(limit: number): Promise<string[]> {
    const rows = await this.prisma.habitProfile.findMany({
      orderBy: [{ followers: { _count: 'desc' } }],
      take: limit,
      select: { userId: true },
    });
    return rows.map((r) => r.userId);
  }

  async getBatchUserIds(limit: number): Promise<string[]> {
    const rows = await this.prisma.habitProfile.findMany({
      take: limit,
      select: { userId: true },
    });
    return rows.map((r) => r.userId);
  }
}
