export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  LIFETIME = 'LIFETIME',
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

/** App-level settings (privacy, task defaults, pomodoro). 1:1 with HabitProfile. */
export class ProfileSettingsEntity {
  userId!: string;
  isSearchable!: boolean;
  analyticsEnabled!: boolean;
  profileVisibility!: PostVisibility;
  challengeVisibility!: PostVisibility;
  challengePostVisibility!: PostVisibility;
  taskDailyReminderTime!: string | null;
  taskWeekStartDay!: number;
  taskArchiveVisible!: boolean;
  pomodoroFocusDuration!: number;
  pomodoroBreakDuration!: number;
  pomodoroLongBreakDuration!: number;

  constructor(partial: Partial<ProfileSettingsEntity>) {
    Object.assign(this, partial);
  }
}

export class HabitProfileEntity {
  userId!: string;
  username!: string;
  subscriptionTier!: SubscriptionTier;
  bio!: string | null;
  points!: number;
  isTaggingAllowed!: boolean;
  avatarUrl?: string | null;

  // Counters or simplified relations for the domain
  followerCount?: number;
  followingCount?: number;

  constructor(partial: Partial<HabitProfileEntity>) {
    Object.assign(this, partial);
  }
}

export class FollowEntity {
  followerId!: string;
  followingId!: string;
  createdAt!: Date;

  constructor(partial: Partial<FollowEntity>) {
    Object.assign(this, partial);
  }
}

export class UserBlockEntity {
  id!: string;
  profileId!: string;
  blockedId!: string;
  createdAt!: Date;

  constructor(partial: Partial<UserBlockEntity>) {
    Object.assign(this, partial);
  }
}
