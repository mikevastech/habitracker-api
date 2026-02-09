import { ChallengeEntity, ChallengeMemberEntity } from '../../domain/entities/community.entity';
import type {
  ChallengeProgress,
  ListChallengesOptions,
} from '../../domain/repositories/challenge.repository.interface';

export interface IChallengeRemoteDataSource {
  create(
    data: Partial<ChallengeEntity> & { creatorId: string; groupId: string },
  ): Promise<ChallengeEntity>;
  findById(id: string): Promise<ChallengeEntity | null>;
  list(options: ListChallengesOptions): Promise<{ items: ChallengeEntity[]; nextCursor?: string }>;

  addMember(challengeId: string, userId: string): Promise<ChallengeMemberEntity>;
  removeMember(challengeId: string, userId: string): Promise<void>;
  isMember(challengeId: string, userId: string): Promise<boolean>;

  listMembers(
    challengeId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: ChallengeMemberEntity[]; nextCursor?: string }>;

  getMemberProgress(challengeId: string, userId: string): Promise<ChallengeProgress | null>;

  markCompleted(challengeId: string, completedByUserId: string): Promise<void>;
}

export const IChallengeRemoteDataSource = Symbol('IChallengeRemoteDataSource');
