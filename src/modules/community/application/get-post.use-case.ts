import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { PostEntity, PostVisibility } from '../domain/entities/community.entity';

@Injectable()
export class GetPostUseCase {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  /**
   * Returns post by id. If callerUserId is set, allows PRIVATE posts for the author;
   * otherwise only PUBLIC posts are visible.
   */
  async execute(postId: string, options?: { callerUserId?: string }): Promise<PostEntity> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const isAuthor = options?.callerUserId && post.userId === options.callerUserId;
    if (post.visibility === PostVisibility.PRIVATE && !isAuthor) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
