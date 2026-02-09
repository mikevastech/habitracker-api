import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { RedisModule } from '../../shared/infrastructure/redis/redis.module';
import { ProfileModule } from '../profile/profile.module';
import { PostController } from './presentation/post.controller';
import { IPostRepository } from './domain/repositories/post.repository.interface';
import { PostRepositoryImpl } from './infrastructure/repositories/post.repository.impl';
import { IPostRemoteDataSource } from './infrastructure/data-sources/post.remote.datasource.interface';
import { PostRemoteDataSourceImpl } from './infrastructure/data-sources/post.remote.datasource.impl';
import { IPostLocalDataSource } from './infrastructure/data-sources/post.local.datasource.interface';
import { PostLocalDataSourceImpl } from './infrastructure/data-sources/post.local.datasource.impl';
import { CreatePostUseCase } from './application/create-post.use-case';
import { GetFeedUseCase } from './application/get-feed.use-case';
import { ListPostsUseCase } from './application/list-posts.use-case';
import { LikePostUseCase } from './application/like-post.use-case';
import { AddCommentUseCase } from './application/add-comment.use-case';
import { ListCommentsUseCase } from './application/list-comments.use-case';

@Module({
  imports: [PrismaModule, RedisModule, ProfileModule],
  controllers: [PostController],
  providers: [
    CreatePostUseCase,
    GetFeedUseCase,
    ListPostsUseCase,
    LikePostUseCase,
    AddCommentUseCase,
    ListCommentsUseCase,
    {
      provide: IPostRepository,
      useClass: PostRepositoryImpl,
    },
    {
      provide: IPostRemoteDataSource,
      useClass: PostRemoteDataSourceImpl,
    },
    {
      provide: IPostLocalDataSource,
      useClass: PostLocalDataSourceImpl,
    },
  ],
  exports: [IPostRepository],
})
export class CommunityModule {}
