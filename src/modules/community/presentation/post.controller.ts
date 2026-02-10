import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { CreatePostUseCase } from '../application/create-post.use-case';
import { CreatePostDto } from '../application/dtos/create-post.dto';
import { AddCommentDto } from '../application/dtos/add-comment.dto';
import { GetFeedUseCase } from '../application/get-feed.use-case';
import { GetPostUseCase } from '../application/get-post.use-case';
import { DeletePostUseCase } from '../application/delete-post.use-case';
import { ListPostsUseCase } from '../application/list-posts.use-case';
import { LikePostUseCase } from '../application/like-post.use-case';
import { AddCommentUseCase } from '../application/add-comment.use-case';
import { ListCommentsUseCase } from '../application/list-comments.use-case';
import { PostVisibility } from '../domain/entities/community.entity';
import {
  PostResponseDto,
  CommentResponseDto,
  PaginatedPostsResponseDto,
  PaginatedCommentsResponseDto,
} from '../application/dtos/community-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getFeedUseCase: GetFeedUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly likePostUseCase: LikePostUseCase,
    private readonly addCommentUseCase: AddCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
  ) {}

  @Get('feed')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
  async feed(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    const offset = Math.max(parseInt(offsetStr ?? '0', 10) || 0, 0);
    return this.getFeedUseCase.execute({ userId: user.id, limit, offset });
  }

  @Get(':id')
  @ApiOkResponse({ type: PostResponseDto })
  async getById(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.getPostUseCase.execute({ postId: id, callerUserId: user?.id });
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @ApiNoContentResponse()
  async delete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.deletePostUseCase.execute({ postId: id, userId: user.id });
  }

  @Post()
  @UseGuards(SessionGuard)
  @ApiCreatedResponse({ type: PostResponseDto })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Omit<CreatePostDto, 'userId'>,
  ) {
    return this.createPostUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get()
  @ApiOkResponse({ type: PaginatedPostsResponseDto })
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
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: PostResponseDto })
  async like(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.likePostUseCase.execute({ postId: id, userId: user.id, action: 'LIKE' });
  }

  @Delete(':id/like')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: PostResponseDto })
  async unlike(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.likePostUseCase.execute({ postId: id, userId: user.id, action: 'UNLIKE' });
  }

  @Post(':id/comments')
  @UseGuards(SessionGuard)
  @ApiCreatedResponse({ type: CommentResponseDto })
  async addComment(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddCommentDto,
  ) {
    return this.addCommentUseCase.execute({
      postId: id,
      userId: user.id,
      dto,
    });
  }

  @Get(':id/comments')
  @ApiOkResponse({ type: PaginatedCommentsResponseDto })
  async listComments(
    @Param('id') id: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '10', 10) || 10, 1), 50);
    return this.listCommentsUseCase.execute({ postId: id, limit, cursor });
  }
}
