import type { Paginated } from '../../../../shared/domain/paginated.types';
import {
  HabitProfileEntity,
  ProfileSettingsEntity,
  FollowEntity,
} from '../entities/profile.entity';

export interface IProfileRepository {
  findByUserId(userId: string): Promise<HabitProfileEntity | null>;
  findByUsername(username: string): Promise<HabitProfileEntity | null>;
  update(userId: string, data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity>;
  create(data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity>;

  getSettings(userId: string): Promise<ProfileSettingsEntity | null>;
  updateSettings(
    userId: string,
    data: Partial<ProfileSettingsEntity>,
  ): Promise<ProfileSettingsEntity>;
  createSettings(
    userId: string,
    data?: Partial<ProfileSettingsEntity>,
  ): Promise<ProfileSettingsEntity>;

  follow(followerId: string, followingId: string): Promise<FollowEntity>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  getFollowers(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<Paginated<HabitProfileEntity>>;
  getFollowing(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<Paginated<HabitProfileEntity>>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;

  getFollowersCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;

  findManyByUserIds(userIds: string[]): Promise<HabitProfileEntity[]>;

  getTopUserIdsByFollowerCount(limit: number): Promise<string[]>;

  getBatchUserIds(limit: number): Promise<string[]>;

  getSettingsBatch(userIds: string[]): Promise<Map<string, ProfileSettingsEntity>>;
  getActivityScores(userIds: string[], lastDays?: number): Promise<Map<string, number>>;
  getChallengeParticipationCount(userIds: string[]): Promise<Map<string, number>>;
}

export const IProfileRepository = Symbol('IProfileRepository');
