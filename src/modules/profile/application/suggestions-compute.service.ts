import { Inject, Injectable } from '@nestjs/common';
import { IFollowLocalDataSource } from '../infrastructure/data-sources/follow.local.datasource.interface';

const FRIENDS_SAMPLE = 10;
const TOP_SUGGESTIONS = 20;
/** How much to boost score per mutual follower (SINTER size) in Level 3. */
const MUTUAL_FOLLOWERS_WEIGHT = 2;
/** Level 3: how many candidates to score with SINTER before taking top N. */
const GRAPH_CANDIDATES_POOL = 50;

/**
 * Level 1: "Zajednički prijatelji" – frequency map over friends' following.
 * Level 3: same base + SINTER (zajednički pratioci) boost; optional profile/habit signals later.
 */
@Injectable()
export class SuggestionsComputeService {
  constructor(
    @Inject(IFollowLocalDataSource)
    private readonly followLocal: IFollowLocalDataSource,
  ) {}

  /**
   * Compute suggested user IDs from mutual graph: friends' following, exclude self and already following.
   */
  async computeMutualFriendSuggestions(userId: string, limit = TOP_SUGGESTIONS): Promise<string[]> {
    const withScores = await this.computeMutualFriendSuggestionsWithScores(userId, limit);
    return withScores.map((x) => x.id);
  }

  /**
   * Level 3: candidates scored by (1) frequency in friends' following + (2) SINTER(my followers, candidate followers).
   * Used by graph-proximity worker for "Pro" suggestions.
   */
  async computeGraphProximitySuggestions(userId: string, limit: number): Promise<string[]> {
    const candidates = await this.computeMutualFriendSuggestionsWithScores(
      userId,
      GRAPH_CANDIDATES_POOL,
    );
    if (candidates.length === 0) return [];

    const withMutualBoost = await Promise.all(
      candidates.map(async ({ id, score }) => {
        const mutual = await this.followLocal.getMutualFollowersCount(userId, id);
        return { id, score: score + MUTUAL_FOLLOWERS_WEIGHT * mutual };
      }),
    );

    return withMutualBoost
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.id);
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
