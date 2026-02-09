import { PostEntity } from '../../domain/entities/community.entity';

export interface IPostLocalDataSource {
  getCachedPost(id: string): Promise<PostEntity | null>;
  getCachedPosts(ids: string[]): Promise<(PostEntity | null)[]>;
  setCachedPost(id: string, post: PostEntity): Promise<void>;
  deleteCachedPost(id: string): Promise<void>;

  // Strategy A/B: Caching lists
  getCachedFeed(key: string): Promise<{ items: PostEntity[]; nextCursor?: string } | null>;
  setCachedFeed(
    key: string,
    data: { items: PostEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void>;
}

export const IPostLocalDataSource = Symbol('IPostLocalDataSource');
