import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface DeletePostParams {
  postId: string;
  userId: string;
}

@Injectable()
export class DeletePostUseCase implements IUseCase<void, DeletePostParams> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: DeletePostParams): Promise<void> {
    const post = await this.postRepository.findById(params.postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== params.userId) {
      throw new ForbiddenException('Not allowed to delete this post');
    }
    await this.postRepository.delete(params.postId);
  }
}
