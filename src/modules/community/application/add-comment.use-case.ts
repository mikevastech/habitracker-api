import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { AddCommentDto } from './dtos/add-comment.dto';

export interface AddCommentParams {
  postId: string;
  userId: string;
  dto: AddCommentDto;
}

@Injectable()
export class AddCommentUseCase implements IUseCase<void, AddCommentParams> {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(params: AddCommentParams): Promise<void> {
    await this.postRepository.addComment(
      params.postId,
      params.userId,
      params.dto.content,
    );
  }
}
