import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';

@Injectable()
export class LikePostUseCase {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: string, userId: string, action: 'LIKE' | 'UNLIKE'): Promise<void> {
    if (action === 'LIKE') {
      await this.postRepository.like(postId, userId);
    } else {
      await this.postRepository.unlike(postId, userId);
    }
  }
}
