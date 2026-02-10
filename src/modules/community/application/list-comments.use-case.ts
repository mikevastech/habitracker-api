import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { CommentEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';

export interface ListCommentsParams {
  postId: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListCommentsUseCase
  implements IUseCase<Paginated<CommentEntity>, ListCommentsParams>
{
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: ListCommentsParams): Promise<Paginated<CommentEntity>> {
    return this.postRepository.listComments(params.postId, params.limit, params.cursor);
  }
}
