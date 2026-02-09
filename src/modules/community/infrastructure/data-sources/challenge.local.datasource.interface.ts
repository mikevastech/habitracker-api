import { ChallengeEntity } from '../../domain/entities/community.entity';

export interface IChallengeLocalDataSource {
  getCachedChallenge(id: string): Promise<ChallengeEntity | null>;
  setCachedChallenge(id: string, challenge: ChallengeEntity): Promise<void>;
  deleteCachedChallenge(id: string): Promise<void>;

  getCachedList(key: string): Promise<{ items: ChallengeEntity[]; nextCursor?: string } | null>;
  setCachedList(
    key: string,
    data: { items: ChallengeEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void>;
}

export const IChallengeLocalDataSource = Symbol('IChallengeLocalDataSource');
