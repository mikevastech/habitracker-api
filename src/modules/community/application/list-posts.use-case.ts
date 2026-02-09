import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { PostEntity } from '../domain/entities/community.entity';

export interface ListPostsOptions {
  userId?: string;
  groupId?: string;
  limit: number;
  cursor?: string;
  visibility?: string;
}

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(options: ListPostsOptions): Promise<{ items: PostEntity[]; nextCursor?: string }> {
    return this.postRepository.list(options);
  }
}
