import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import { HabitProfileEntity, SubscriptionTier } from '../../domain/entities/profile.entity';
import { IProfileRemoteDataSource } from './profile.remote.datasource.interface';
import { SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';

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
}
