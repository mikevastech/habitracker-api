import { Injectable, Inject } from '@nestjs/common';
import {
  IChallengeRepository,
  ListChallengesOptions,
} from '../../domain/repositories/challenge.repository.interface';
import { ChallengeEntity, ChallengeMemberEntity } from '../../domain/entities/community.entity';
import { IChallengeLocalDataSource } from '../data-sources/challenge.local.datasource.interface';
import { IChallengeRemoteDataSource } from '../data-sources/challenge.remote.datasource.interface';

@Injectable()
export class ChallengeRepositoryImpl implements IChallengeRepository {
  constructor(
    @Inject(IChallengeLocalDataSource)
    private readonly local: IChallengeLocalDataSource,
    @Inject(IChallengeRemoteDataSource)
    private readonly remote: IChallengeRemoteDataSource,
  ) {}

  async create(
    data: Partial<ChallengeEntity> & { creatorId: string; groupId: string },
  ): Promise<ChallengeEntity> {
    const created = await this.remote.create(data);
    await this.local.setCachedChallenge(created.id, created);
    return created;
  }

  async findById(id: string): Promise<ChallengeEntity | null> {
    const cached = await this.local.getCachedChallenge(id);
    if (cached) return cached;
    const remote = await this.remote.findById(id);
    if (remote) await this.local.setCachedChallenge(id, remote);
    return remote;
  }

  async list(
    options: ListChallengesOptions,
  ): Promise<{ items: ChallengeEntity[]; nextCursor?: string }> {
    const cacheKey = `g${options.groupId ?? ''}:u${options.userId ?? ''}:lim${options.limit}:cur${options.cursor ?? 'start'}`;
    const cached = await this.local.getCachedList(cacheKey);
    if (cached) return cached;
    const result = await this.remote.list(options);
    await this.local.setCachedList(cacheKey, result, 60);
    return result;
  }

  async join(challengeId: string, userId: string): Promise<ChallengeMemberEntity> {
    const member = await this.remote.addMember(challengeId, userId);
    await this.local.deleteCachedChallenge(challengeId);
    return member;
  }

  async leave(challengeId: string, userId: string): Promise<void> {
    await this.remote.removeMember(challengeId, userId);
    await this.local.deleteCachedChallenge(challengeId);
  }

  async isMember(challengeId: string, userId: string): Promise<boolean> {
    return this.remote.isMember(challengeId, userId);
  }

  async listMembers(
    challengeId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: ChallengeMemberEntity[]; nextCursor?: string }> {
    return this.remote.listMembers(challengeId, limit, cursor);
  }

  async getMemberProgress(
    challengeId: string,
    userId: string,
  ): Promise<
    import('../../domain/repositories/challenge.repository.interface').ChallengeProgress | null
  > {
    return this.remote.getMemberProgress(challengeId, userId);
  }

  async markCompleted(challengeId: string, completedByUserId: string): Promise<void> {
    await this.remote.markCompleted(challengeId, completedByUserId);
    await this.local.deleteCachedChallenge(challengeId);
  }
}
