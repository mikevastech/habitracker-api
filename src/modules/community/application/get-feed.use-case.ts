import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { IFollowLocalDataSource } from '../../profile/infrastructure/data-sources/follow.local.datasource.interface';
import type { PostEntity } from '../domain/entities/community.entity';

@Injectable()
export class GetFeedUseCase {
  constructor(
    @Inject(IFollowLocalDataSource)
    private readonly followLocalDataSource: IFollowLocalDataSource,
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(userId: string, limit: number, offset = 0): Promise<PostEntity[]> {
    const postIds = await this.followLocalDataSource.getFeed(userId, limit, offset);
    if (postIds.length === 0) return [];
    const posts = await this.postRepository.findByIds(postIds);
    const byId = new Map(posts.map((p) => [p.id, p]));
    return postIds.map((id) => byId.get(id)).filter((p): p is PostEntity => p != null);
  }
}
