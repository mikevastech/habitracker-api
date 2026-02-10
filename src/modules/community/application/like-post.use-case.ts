import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface LikePostParams {
  postId: string;
  userId: string;
  action: 'LIKE' | 'UNLIKE';
}

@Injectable()
export class LikePostUseCase implements IUseCase<void, LikePostParams> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: LikePostParams): Promise<void> {
    if (params.action === 'LIKE') {
      await this.postRepository.like(params.postId, params.userId);
    } else {
      await this.postRepository.unlike(params.postId, params.userId);
    }
  }
}
