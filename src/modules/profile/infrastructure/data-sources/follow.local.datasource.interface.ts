/**
 * Redis-backed follow graph: counters (INCR/DECR), sets (following/followers),
 * feed inbox. TTL 30 days on user keys; refresh on access.
 */
export interface IFollowLocalDataSource {
  addFollow(followerId: string, followingId: string): Promise<void>;
  removeFollow(followerId: string, followingId: string): Promise<void>;

  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowersCount(userId: string): Promise<number | null>;
  getFollowingCount(userId: string): Promise<number | null>;

  getFollowersIds(userId: string): Promise<string[]>;
  getFollowingIds(userId: string): Promise<string[]>;

  /** Size of SINTER(user:A:followers, user:B:followers). For graph-proximity scoring. */
  getMutualFollowersCount(userIdA: string, userIdB: string): Promise<number>;

  /** Reconcile: set counters from DB (e.g. on login or daily). */
  setCounters(userId: string, followersCount: number, followingCount: number): Promise<void>;

  /** Fan-out: add post to each follower's feed. Call after creating a post. */
  addPostToFollowersFeeds(authorId: string, postId: string, timestamp: Date): Promise<void>;
  getFeed(userId: string, limit: number, offset?: number): Promise<string[]>;

  /** Suggestions: per-user cache (Level 1 / Level 3). TTL 24h. */
  getSuggestions(userId: string): Promise<string[] | null>;
  setSuggestions(userId: string, userIds: string[]): Promise<void>;

  /** Global trend fallback (Level 2). */
  getGlobalSuggestions(): Promise<string[] | null>;
  setGlobalSuggestions(userIds: string[]): Promise<void>;
}

export const IFollowLocalDataSource = Symbol('IFollowLocalDataSource');
