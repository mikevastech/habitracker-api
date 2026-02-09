import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { CommentEntity } from '../domain/entities/community.entity';

@Injectable()
export class ListCommentsUseCase {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    postId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: CommentEntity[]; nextCursor?: string }> {
    return this.postRepository.listComments(postId, limit, cursor);
  }
}
