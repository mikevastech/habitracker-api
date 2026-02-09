import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';
import { IProfileLocalDataSource } from '../data-sources/profile.local.datasource.interface';
import { IProfileRemoteDataSource } from '../data-sources/profile.remote.datasource.interface';
import { IFollowLocalDataSource } from '../data-sources/follow.local.datasource.interface';
import {
  HabitProfileEntity,
  ProfileSettingsEntity,
  FollowEntity,
} from '../../domain/entities/profile.entity';

@Injectable()
export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(
    @Inject(IProfileLocalDataSource)
    private localDataSource: IProfileLocalDataSource,
    @Inject(IProfileRemoteDataSource)
    private remoteDataSource: IProfileRemoteDataSource,
    @Inject(IFollowLocalDataSource)
    private followLocalDataSource: IFollowLocalDataSource,
  ) {}

  async findByUserId(userId: string): Promise<HabitProfileEntity | null> {
    const cached = await this.localDataSource.getCachedProfile(userId);
    if (cached) {
      await this.overrideCountsFromFollowCache(cached);
      return cached;
    }

    const remote = await this.remoteDataSource.findByUserId(userId);
    if (remote) {
      await this.localDataSource.setCachedProfile(userId, remote);
      await this.overrideCountsFromFollowCache(remote);
    }

    return remote;
  }

  private async overrideCountsFromFollowCache(profile: HabitProfileEntity): Promise<void> {
    const [followers, following] = await Promise.all([
      this.followLocalDataSource.getFollowersCount(profile.userId),
      this.followLocalDataSource.getFollowingCount(profile.userId),
    ]);
    if (followers != null) profile.followerCount = followers;
    if (following != null) profile.followingCount = following;
  }

  async findByUsername(username: string): Promise<HabitProfileEntity | null> {
    // Usually used for uniqueness checks, go direct to remote or implement specific cache if needed
    return this.remoteDataSource.findByUsername(username);
  }

  async update(userId: string, data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity> {
    const updated = await this.remoteDataSource.update(userId, data);
    await this.localDataSource.setCachedProfile(userId, updated);
    return updated;
  }

  async create(data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity> {
    const created = await this.remoteDataSource.create(data);
    await this.localDataSource.setCachedProfile(created.userId, created);
    return created;
  }

  async getSettings(userId: string): Promise<ProfileSettingsEntity | null> {
    return this.remoteDataSource.getSettings(userId);
  }

  async updateSettings(
    userId: string,
    data: Partial<ProfileSettingsEntity>,
  ): Promise<ProfileSettingsEntity> {
    return this.remoteDataSource.updateSettings(userId, data);
  }

  async createSettings(
    userId: string,
    data?: Partial<ProfileSettingsEntity>,
  ): Promise<ProfileSettingsEntity> {
    return this.remoteDataSource.createSettings(userId, data);
  }

  async follow(followerId: string, followingId: string): Promise<FollowEntity> {
    const result = await this.remoteDataSource.follow(followerId, followingId);
    try {
      await this.followLocalDataSource.addFollow(followerId, followingId);
    } catch (e) {
      // Redis failure: log, don't fail the request; DB is source of truth
    }
    return result;
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.remoteDataSource.unfollow(followerId, followingId);
    try {
      await this.followLocalDataSource.removeFollow(followerId, followingId);
    } catch (e) {
      // Redis failure: log, don't fail the request
    }
  }

  async getFollowers(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }> {
    return this.remoteDataSource.getFollowers(profileId, limit, cursor);
  }

  async getFollowing(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }> {
    return this.remoteDataSource.getFollowing(profileId, limit, cursor);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const ids = await this.followLocalDataSource.getFollowingIds(followerId);
    if (ids.length > 0) {
      return ids.includes(followingId);
    }
    const fromDb = await this.remoteDataSource.isFollowing(followerId, followingId);
    return fromDb;
  }

  async getFollowersCount(userId: string): Promise<number> {
    const cached = await this.followLocalDataSource.getFollowersCount(userId);
    if (cached != null) return cached;
    const count = await this.remoteDataSource.getFollowersCount(userId);
    try {
      const followingCount = await this.remoteDataSource.getFollowingCount(userId);
      await this.followLocalDataSource.setCounters(userId, count, followingCount);
    } catch {
      // optional warm; ignore
    }
    return count;
  }

  async getFollowingCount(userId: string): Promise<number> {
    const cached = await this.followLocalDataSource.getFollowingCount(userId);
    if (cached != null) return cached;
    const count = await this.remoteDataSource.getFollowingCount(userId);
    try {
      const followersCount = await this.remoteDataSource.getFollowersCount(userId);
      await this.followLocalDataSource.setCounters(userId, followersCount, count);
    } catch {
      // optional warm; ignore
    }
    return count;
  }

  async findManyByUserIds(userIds: string[]): Promise<HabitProfileEntity[]> {
    return this.remoteDataSource.findManyByUserIds(userIds);
  }

  async getTopUserIdsByFollowerCount(limit: number): Promise<string[]> {
    return this.remoteDataSource.getTopUserIdsByFollowerCount(limit);
  }

  async getBatchUserIds(limit: number): Promise<string[]> {
    return this.remoteDataSource.getBatchUserIds(limit);
  }

  async getSettingsBatch(userIds: string[]): Promise<Map<string, ProfileSettingsEntity>> {
    return this.remoteDataSource.getSettingsBatch(userIds);
  }

  async getActivityScores(userIds: string[], lastDays?: number): Promise<Map<string, number>> {
    return this.remoteDataSource.getActivityScores(userIds, lastDays);
  }

  async getChallengeParticipationCount(userIds: string[]): Promise<Map<string, number>> {
    return this.remoteDataSource.getChallengeParticipationCount(userIds);
  }
}
