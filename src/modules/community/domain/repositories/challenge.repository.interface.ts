import { ChallengeEntity, ChallengeMemberEntity } from '../entities/community.entity';

export interface ListChallengesOptions {
  groupId?: string;
  /** Challenges where userId is a member. */
  userId?: string;
  limit: number;
  cursor?: string;
}

export interface ChallengeProgress {
  currentStreak: number;
  onTrack: boolean;
  requiredStreak: number;
}

export interface IChallengeRepository {
  create(
    data: Partial<ChallengeEntity> & { creatorId: string; groupId: string },
  ): Promise<ChallengeEntity>;
  findById(id: string): Promise<ChallengeEntity | null>;
  list(options: ListChallengesOptions): Promise<{ items: ChallengeEntity[]; nextCursor?: string }>;

  join(challengeId: string, userId: string): Promise<ChallengeMemberEntity>;
  leave(challengeId: string, userId: string): Promise<void>;
  isMember(challengeId: string, userId: string): Promise<boolean>;

  listMembers(
    challengeId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: ChallengeMemberEntity[]; nextCursor?: string }>;

  getMemberProgress(challengeId: string, userId: string): Promise<ChallengeProgress | null>;

  /** Set status to COMPLETED and award points to members (RewardEvent + profile.points). */
  markCompleted(challengeId: string, completedByUserId: string): Promise<void>;
}

export const IChallengeRepository = Symbol('IChallengeRepository');
