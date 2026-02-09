import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) {
      throw new ForbiddenException('Not allowed to delete this post');
    }
    await this.postRepository.delete(postId);
  }
}
