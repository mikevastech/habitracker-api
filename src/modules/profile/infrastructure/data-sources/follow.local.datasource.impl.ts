import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { IFollowLocalDataSource } from './follow.local.datasource.interface';

const PREFIX = 'user:';
const SUFFIX_FOLLOWING = ':following';
const SUFFIX_FOLLOWERS = ':followers';
const SUFFIX_FOLLOWING_COUNT = ':following_count';
const SUFFIX_FOLLOWERS_COUNT = ':followers_count';
const SUFFIX_FEED = ':feed';
const SUFFIX_SUGGESTIONS = ':suggestions';
const GLOBAL_SUGGESTIONS_KEY = 'global:suggestions';

const TTL_DAYS = 30;
const TTL_SECONDS = TTL_DAYS * 86400;
const FEED_TTL_DAYS = 7;
const FEED_TTL_SECONDS = FEED_TTL_DAYS * 86400;

@Injectable()
export class FollowLocalDataSourceImpl implements IFollowLocalDataSource {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private async refreshTtl(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await Promise.all(keys.map((k) => this.redis.expire(k, TTL_SECONDS)));
  }

  async addFollow(followerId: string, followingId: string): Promise<void> {
    const keyFollowing = `${PREFIX}${followerId}${SUFFIX_FOLLOWING}`;
    const keyFollowers = `${PREFIX}${followingId}${SUFFIX_FOLLOWERS}`;
    const keyFollowingCount = `${PREFIX}${followerId}${SUFFIX_FOLLOWING_COUNT}`;
    const keyFollowersCount = `${PREFIX}${followingId}${SUFFIX_FOLLOWERS_COUNT}`;

    await this.redis
      .pipeline()
      .sadd(keyFollowing, followingId)
      .sadd(keyFollowers, followerId)
      .incr(keyFollowingCount)
      .incr(keyFollowersCount)
      .expire(keyFollowing, TTL_SECONDS)
      .expire(keyFollowers, TTL_SECONDS)
      .expire(keyFollowingCount, TTL_SECONDS)
      .expire(keyFollowersCount, TTL_SECONDS)
      .exec();
  }

  async removeFollow(followerId: string, followingId: string): Promise<void> {
    const keyFollowing = `${PREFIX}${followerId}${SUFFIX_FOLLOWING}`;
    const keyFollowers = `${PREFIX}${followingId}${SUFFIX_FOLLOWERS}`;
    const keyFollowingCount = `${PREFIX}${followerId}${SUFFIX_FOLLOWING_COUNT}`;
    const keyFollowersCount = `${PREFIX}${followingId}${SUFFIX_FOLLOWERS_COUNT}`;

    const pipe = this.redis
      .pipeline()
      .srem(keyFollowing, followingId)
      .srem(keyFollowers, followerId)
      .decr(keyFollowingCount)
      .decr(keyFollowersCount);
    await pipe.exec();
    await this.refreshTtl(keyFollowing, keyFollowers, keyFollowingCount, keyFollowersCount);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const key = `${PREFIX}${followerId}${SUFFIX_FOLLOWING}`;
    const exists = await this.redis.sismember(key, followingId);
    if (exists) await this.redis.expire(key, TTL_SECONDS);
    return exists === 1;
  }

  async getFollowersCount(userId: string): Promise<number | null> {
    const key = `${PREFIX}${userId}${SUFFIX_FOLLOWERS_COUNT}`;
    const val = await this.redis.get(key);
    if (val === null) return null;
    await this.redis.expire(key, TTL_SECONDS);
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : Math.max(0, n);
  }

  async getFollowingCount(userId: string): Promise<number | null> {
    const key = `${PREFIX}${userId}${SUFFIX_FOLLOWING_COUNT}`;
    const val = await this.redis.get(key);
    if (val === null) return null;
    await this.redis.expire(key, TTL_SECONDS);
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : Math.max(0, n);
  }

  async getFollowersIds(userId: string): Promise<string[]> {
    const key = `${PREFIX}${userId}${SUFFIX_FOLLOWERS}`;
    const ids = await this.redis.smembers(key);
    if (ids.length > 0) await this.redis.expire(key, TTL_SECONDS);
    return ids;
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    const key = `${PREFIX}${userId}${SUFFIX_FOLLOWING}`;
    const ids = await this.redis.smembers(key);
    if (ids.length > 0) await this.redis.expire(key, TTL_SECONDS);
    return ids;
  }

  async getMutualFollowersCount(userIdA: string, userIdB: string): Promise<number> {
    const keyA = `${PREFIX}${userIdA}${SUFFIX_FOLLOWERS}`;
    const keyB = `${PREFIX}${userIdB}${SUFFIX_FOLLOWERS}`;
    const inter = await this.redis.sinter(keyA, keyB);
    return inter.length;
  }

  async setCounters(userId: string, followersCount: number, followingCount: number): Promise<void> {
    const keyFollowers = `${PREFIX}${userId}${SUFFIX_FOLLOWERS_COUNT}`;
    const keyFollowing = `${PREFIX}${userId}${SUFFIX_FOLLOWING_COUNT}`;
    await this.redis
      .pipeline()
      .set(keyFollowers, String(Math.max(0, followersCount)), 'EX', TTL_SECONDS)
      .set(keyFollowing, String(Math.max(0, followingCount)), 'EX', TTL_SECONDS)
      .exec();
  }

  async addPostToFollowersFeeds(authorId: string, postId: string, timestamp: Date): Promise<void> {
    const followerIds = await this.getFollowersIds(authorId);
    if (followerIds.length === 0) return;
    const score = timestamp.getTime();
    const pipe = this.redis.pipeline();
    for (const userId of followerIds) {
      const feedKey = `${PREFIX}${userId}${SUFFIX_FEED}`;
      pipe.zadd(feedKey, score, postId);
      pipe.expire(feedKey, FEED_TTL_SECONDS);
    }
    await pipe.exec();
  }

  async getFeed(userId: string, limit: number, offset = 0): Promise<string[]> {
    const feedKey = `${PREFIX}${userId}${SUFFIX_FEED}`;
    const postIds = await this.redis.zrevrange(feedKey, offset, offset + limit - 1);
    if (postIds.length > 0) await this.redis.expire(feedKey, FEED_TTL_SECONDS);
    return postIds;
  }

  private static readonly SUGGESTIONS_TTL_SECONDS = 86400; // 24h

  async getSuggestions(userId: string): Promise<string[] | null> {
    const key = `${PREFIX}${userId}${SUFFIX_SUGGESTIONS}`;
    const list = await this.redis.lrange(key, 0, -1);
    if (list.length === 0) return null;
    await this.redis.expire(key, FollowLocalDataSourceImpl.SUGGESTIONS_TTL_SECONDS);
    return list;
  }

  async setSuggestions(userId: string, userIds: string[]): Promise<void> {
    const key = `${PREFIX}${userId}${SUFFIX_SUGGESTIONS}`;
    if (userIds.length === 0) {
      await this.redis.del(key);
      return;
    }
    await this.redis.del(key);
    if (userIds.length > 0) {
      await this.redis.rpush(key, ...userIds);
      await this.redis.expire(key, FollowLocalDataSourceImpl.SUGGESTIONS_TTL_SECONDS);
    }
  }

  async getGlobalSuggestions(): Promise<string[] | null> {
    const list = await this.redis.lrange(GLOBAL_SUGGESTIONS_KEY, 0, -1);
    if (list.length === 0) return null;
    return list;
  }

  async setGlobalSuggestions(userIds: string[]): Promise<void> {
    await this.redis.del(GLOBAL_SUGGESTIONS_KEY);
    if (userIds.length > 0) {
      await this.redis.rpush(GLOBAL_SUGGESTIONS_KEY, ...userIds);
      await this.redis.expire(GLOBAL_SUGGESTIONS_KEY, 3600); // 1h, job refreshes hourly
    }
  }
}
