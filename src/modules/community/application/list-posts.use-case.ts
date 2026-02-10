import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { PostEntity } from '../domain/entities/community.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';

export interface ListPostsParams {
  userId?: string;
  groupId?: string;
  limit: number;
  cursor?: string;
  visibility?: string;
}

@Injectable()
export class ListPostsUseCase
  implements IUseCase<Paginated<PostEntity>, ListPostsParams>
{
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: ListPostsParams): Promise<Paginated<PostEntity>> {
    return this.postRepository.list(params);
  }
}
