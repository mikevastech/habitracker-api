import {
  HabitProfileEntity,
  ProfileSettingsEntity,
  FollowEntity,
} from '../../domain/entities/profile.entity';

export interface IProfileRemoteDataSource {
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
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }>;
  getFollowing(
    profileId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ data: HabitProfileEntity[]; nextCursor?: string }>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowersCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;

  findManyByUserIds(userIds: string[]): Promise<HabitProfileEntity[]>;

  /** Top user IDs by follower count (for global suggestions). */
  getTopUserIdsByFollowerCount(limit: number): Promise<string[]>;

  /** Batch of user IDs for background processing (e.g. graph-proximity). */
  getBatchUserIds(limit: number): Promise<string[]>;

  /** Batch load settings by userIds. Missing users get default PUBLIC visibility. */
  getSettingsBatch(userIds: string[]): Promise<Map<string, ProfileSettingsEntity>>;

  /** Sum of totalCompleted (DailyStats) in last N days per user. For habit similarity. */
  getActivityScores(userIds: string[], lastDays?: number): Promise<Map<string, number>>;

  /** Count of ChallengeMember per user. For challenge-participation boost. */
  getChallengeParticipationCount(userIds: string[]): Promise<Map<string, number>>;
}

export const IProfileRemoteDataSource = Symbol('IProfileRemoteDataSource');
