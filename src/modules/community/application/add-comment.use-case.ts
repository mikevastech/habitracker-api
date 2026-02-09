import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository } from '../domain/repositories/post.repository.interface';

export interface AddCommentDto {
  postId: string;
  userId: string;
  content: string;
}

@Injectable()
export class AddCommentUseCase {
  constructor(
    @Inject(IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(dto: AddCommentDto): Promise<void> {
    await this.postRepository.addComment(dto.postId, dto.userId, dto.content);
  }
}
