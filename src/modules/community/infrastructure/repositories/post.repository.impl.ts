import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository } from '../../domain/repositories/post.repository.interface';
import { PostEntity, CommentEntity } from '../../domain/entities/community.entity';
import { IPostLocalDataSource } from '../data-sources/post.local.datasource.interface';
import { IPostRemoteDataSource } from '../data-sources/post.remote.datasource.interface';

@Injectable()
export class PostRepositoryImpl implements IPostRepository {
  constructor(
    @Inject(IPostLocalDataSource)
    private readonly localDataSource: IPostLocalDataSource,
    @Inject(IPostRemoteDataSource)
    private readonly remoteDataSource: IPostRemoteDataSource,
  ) {}

  async findById(id: string): Promise<PostEntity | null> {
    const cached = await this.localDataSource.getCachedPost(id);
    if (cached) return cached;

    const remote = await this.remoteDataSource.findById(id);
    if (remote) {
      await this.localDataSource.setCachedPost(id, remote);
    }
    return remote;
  }

  async findByIds(ids: string[]): Promise<PostEntity[]> {
    if (ids.length === 0) return [];

    // 1. Try batch cache (Strategy B Item lookup)
    const cached = await this.localDataSource.getCachedPosts(ids);
    const results: PostEntity[] = [];
    const missingIds: string[] = [];

    cached.forEach((item, index) => {
      if (item) {
        results.push(item);
      } else {
        missingIds.push(ids[index]);
      }
    });

    if (missingIds.length === 0) return results;

    // 2. Fetch missing from Remote
    const remoteMissing = await this.remoteDataSource.findByIds(missingIds);

    // 3. Cache missing items
    for (const item of remoteMissing) {
      await this.localDataSource.setCachedPost(item.id, item);
      results.push(item);
    }

    // Sort to maintain original order if needed (IDs input order)
    return ids.map((id) => results.find((r) => r.id === id)!).filter(Boolean);
  }

  async create(post: Partial<PostEntity>): Promise<PostEntity> {
    const created = await this.remoteDataSource.create(post);
    await this.localDataSource.setCachedPost(created.id, created);
    return created;
  }

  async update(id: string, post: Partial<PostEntity>): Promise<PostEntity> {
    const updated = await this.remoteDataSource.update(id, post);
    await this.localDataSource.setCachedPost(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.remoteDataSource.delete(id);
    await this.localDataSource.deleteCachedPost(id);
  }

  async list(options: {
    userId?: string;
    groupId?: string;
    limit: number;
    cursor?: string;
    visibility?: string;
  }): Promise<{ items: PostEntity[]; nextCursor?: string }> {
    // Strategy A: Cache "Hot" feeds (Global / Public feed)
    const isGlobalPublic = !options.userId && !options.groupId && options.visibility === 'PUBLIC';
    const cacheKey = `${options.userId || 'global'}:${options.groupId || 'none'}:${options.visibility || 'public'}:lim${options.limit}:cur${options.cursor || 'start'}`;

    // 1. Try Cache
    const cached = await this.localDataSource.getCachedFeed(cacheKey);
    if (cached) return cached;

    // 2. Remote Fetch
    const remote = await this.remoteDataSource.list(options);

    // 3. Set Cache (Global = 5min, Others = 1min)
    const ttl = isGlobalPublic ? 300 : 60;
    await this.localDataSource.setCachedFeed(cacheKey, remote, ttl);

    return remote;
  }

  async like(postId: string, userId: string): Promise<void> {
    await this.remoteDataSource.like(postId, userId);
    await this.localDataSource.deleteCachedPost(postId);
  }

  async unlike(postId: string, userId: string): Promise<void> {
    await this.remoteDataSource.unlike(postId, userId);
    await this.localDataSource.deleteCachedPost(postId);
  }

  async addComment(postId: string, userId: string, content: string): Promise<void> {
    await this.remoteDataSource.addComment(postId, userId, content);
    await this.localDataSource.deleteCachedPost(postId);
  }

  async listComments(
    postId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: CommentEntity[]; nextCursor?: string }> {
    return this.remoteDataSource.listComments(postId, limit, cursor);
  }
}
