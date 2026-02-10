import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { PostEntity, PostVisibility } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetPostParams {
  postId: string;
  callerUserId?: string;
}

@Injectable()
export class GetPostUseCase implements IUseCase<PostEntity, GetPostParams> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  /**
   * Returns post by id. If callerUserId is set, allows PRIVATE posts for the author;
   * otherwise only PUBLIC posts are visible.
   */
  async execute(params: GetPostParams): Promise<PostEntity> {
    const post = await this.postRepository.findById(params.postId);
    if (!post) throw new NotFoundException('Post not found');
    const isAuthor = params.callerUserId && post.userId === params.callerUserId;
    if (post.visibility === PostVisibility.PRIVATE && !isAuthor) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
