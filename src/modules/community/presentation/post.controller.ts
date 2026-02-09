import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { CreatePostUseCase, CreatePostDto } from '../application/create-post.use-case';
import { GetFeedUseCase } from '../application/get-feed.use-case';
import { ListPostsUseCase } from '../application/list-posts.use-case';
import { LikePostUseCase } from '../application/like-post.use-case';
import { AddCommentUseCase } from '../application/add-comment.use-case';
import { ListCommentsUseCase } from '../application/list-comments.use-case';
import { PostVisibility } from '../domain/entities/community.entity';

@Controller('posts')
@UseGuards(SessionGuard)
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getFeedUseCase: GetFeedUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly likePostUseCase: LikePostUseCase,
    private readonly addCommentUseCase: AddCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Omit<CreatePostDto, 'userId'>,
  ) {
    return this.createPostUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get('feed')
  async feed(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    const offset = Math.max(parseInt(offsetStr ?? '0', 10) || 0, 0);
    return this.getFeedUseCase.execute(user.id, limit, offset);
  }

  @Get()
  async list(
    @Query('userId') userId?: string,
    @Query('groupId') groupId?: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @Query('visibility') visibility?: PostVisibility,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listPostsUseCase.execute({
      userId,
      groupId,
      limit,
      cursor,
      visibility,
    });
  }

  @Post(':id/like')
  async like(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.likePostUseCase.execute(id, user.id, 'LIKE');
  }

  @Delete(':id/like')
  async unlike(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.likePostUseCase.execute(id, user.id, 'UNLIKE');
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body('content') content: string,
  ) {
    return this.addCommentUseCase.execute({
      postId: id,
      userId: user.id,
      content,
    });
  }

  @Get(':id/comments')
  async listComments(
    @Param('id') id: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '10', 10) || 10, 1), 50);
    return this.listCommentsUseCase.execute(id, limit, cursor);
  }
}
