import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { IFollowLocalDataSource } from '../../profile/infrastructure/data-sources/follow.local.datasource.interface';
import type { PostEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetFeedParams {
  userId: string;
  limit: number;
  offset?: number;
}

@Injectable()
export class GetFeedUseCase implements IUseCase<PostEntity[], GetFeedParams> {
  constructor(
    @Inject(IFollowLocalDataSource)
    private readonly followLocalDataSource: IFollowLocalDataSource,
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: GetFeedParams): Promise<PostEntity[]> {
    const offset = params.offset ?? 0;
    const postIds = await this.followLocalDataSource.getFeed(params.userId, params.limit, offset);
    if (postIds.length === 0) return [];
    const posts = await this.postRepository.findByIds(postIds);
    const byId = new Map(posts.map((p) => [p.id, p]));
    return postIds.map((id) => byId.get(id)).filter((p): p is PostEntity => p != null);
  }
}
