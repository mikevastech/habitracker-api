import { Inject, Injectable } from '@nestjs/common';
import { IFollowLocalDataSource } from '../infrastructure/data-sources/follow.local.datasource.interface';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { PostVisibility } from '../domain/entities/profile.entity';

const FRIENDS_SAMPLE = 10;
const TOP_SUGGESTIONS = 20;
/** How much to boost score per mutual follower (SINTER size) in Level 3. */
const MUTUAL_FOLLOWERS_WEIGHT = 2;
/** Level 3: how many candidates to score with SINTER before taking top N. */
const GRAPH_CANDIDATES_POOL = 50;
/** Boost for candidates with challengeVisibility === PUBLIC. */
const CHALLENGE_VISIBILITY_BOOST = 1.5;
/** Boost per challenge membership (capped). */
const CHALLENGE_PARTICIPATION_WEIGHT = 0.5;
const CHALLENGE_PARTICIPATION_CAP = 5;
/** Weight for habit similarity (0 = no boost, 1 = strong). */
const HABIT_SIMILARITY_WEIGHT = 1;
const ACTIVITY_LAST_DAYS = 30;

/**
 * Level 1: "Zajednički prijatelji" – frequency map over friends' following.
 * Level 3: + SINTER, profileVisibility filter, challengeVisibility/participation boost, habit similarity.
 */
@Injectable()
export class SuggestionsComputeService {
  constructor(
    @Inject(IFollowLocalDataSource)
    private readonly followLocal: IFollowLocalDataSource,
    @Inject(IProfileRepository)
    private readonly profileRepo: IProfileRepository,
  ) {}

  /**
   * Compute suggested user IDs from mutual graph: friends' following, exclude self and already following.
   */
  async computeMutualFriendSuggestions(userId: string, limit = TOP_SUGGESTIONS): Promise<string[]> {
    const withScores = await this.computeMutualFriendSuggestionsWithScores(userId, limit);
    return withScores.map((x) => x.id);
  }

  /**
   * Level 3: graph + profile settings (visibility filter, challenge boost) + habit similarity.
   */
  async computeGraphProximitySuggestions(userId: string, limit: number): Promise<string[]> {
    const candidates = await this.computeMutualFriendSuggestionsWithScores(
      userId,
      GRAPH_CANDIDATES_POOL,
    );
    if (candidates.length === 0) return [];

    const candidateIds = candidates.map((c) => c.id);
    const [settingsMap, activityScores, challengeCounts] = await Promise.all([
      this.profileRepo.getSettingsBatch(candidateIds),
      this.profileRepo.getActivityScores([userId, ...candidateIds], ACTIVITY_LAST_DAYS),
      this.profileRepo.getChallengeParticipationCount(candidateIds),
    ]);

    const myActivity = activityScores.get(userId) ?? 0;

    const withBoosts = await Promise.all(
      candidates.map(async ({ id, score }) => {
        const settings = settingsMap.get(id);
        if (settings?.profileVisibility === PostVisibility.PRIVATE) {
          return { id, score: -1 };
        }
        let s = score;
        const mutual = await this.followLocal.getMutualFollowersCount(userId, id);
        s += MUTUAL_FOLLOWERS_WEIGHT * mutual;
        if (settings?.challengeVisibility === PostVisibility.PUBLIC) {
          s += CHALLENGE_VISIBILITY_BOOST;
        }
        const challenges = Math.min(challengeCounts.get(id) ?? 0, CHALLENGE_PARTICIPATION_CAP);
        s += CHALLENGE_PARTICIPATION_WEIGHT * challenges;
        const candidateActivity = activityScores.get(id) ?? 0;
        const similarity = this.activitySimilarity(myActivity, candidateActivity);
        s += HABIT_SIMILARITY_WEIGHT * similarity;
        return { id, score: s };
      }),
    );

    return withBoosts
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.id);
  }

  /** 0..1 similarity: high when activities are close (e.g. both low or both high). */
  private activitySimilarity(myScore: number, candidateScore: number): number {
    const sum = myScore + candidateScore + 1;
    const diff = Math.abs(myScore - candidateScore);
    return 1 / (1 + diff / Math.max(sum * 0.5, 1));
  }

  /** Returns candidate IDs with frequency score (for Level 3 to add SINTER boost). */
  private async computeMutualFriendSuggestionsWithScores(
    userId: string,
    limit: number,
  ): Promise<{ id: string; score: number }[]> {
    const myFollowing = await this.followLocal.getFollowingIds(userId);
    if (myFollowing.length === 0) return [];

    const myFollowingSet = new Set(myFollowing);
    const friends = await this.pickActiveFriends(myFollowing, FRIENDS_SAMPLE);
    const freq = new Map<string, number>();

    for (const friendId of friends) {
      const friendFollowing = await this.followLocal.getFollowingIds(friendId);
      for (const id of friendFollowing) {
        if (id === userId || myFollowingSet.has(id)) continue;
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }

    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, score]) => ({ id, score }));
  }

  private async pickActiveFriends(followingIds: string[], max: number): Promise<string[]> {
    const withCounts = await Promise.all(
      followingIds.map(async (id) => {
        const count = await this.followLocal.getFollowersCount(id);
        return { id, count: count ?? 0 };
      }),
    );
    withCounts.sort((a, b) => b.count - a.count);
    return withCounts.slice(0, max).map((x) => x.id);
  }
}
