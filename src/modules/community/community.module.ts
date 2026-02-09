import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { RedisModule } from '../../shared/infrastructure/redis/redis.module';
import { ProfileModule } from '../profile/profile.module';
import { PostController } from './presentation/post.controller';
import { GroupController } from './presentation/group.controller';
import { ChallengeController } from './presentation/challenge.controller';
import { IPostRepository } from './domain/repositories/post.repository.interface';
import { IGroupRepository } from './domain/repositories/group.repository.interface';
import { IChallengeRepository } from './domain/repositories/challenge.repository.interface';
import { PostRepositoryImpl } from './infrastructure/repositories/post.repository.impl';
import { GroupRepositoryImpl } from './infrastructure/repositories/group.repository.impl';
import { ChallengeRepositoryImpl } from './infrastructure/repositories/challenge.repository.impl';
import { IPostRemoteDataSource } from './infrastructure/data-sources/post.remote.datasource.interface';
import { PostRemoteDataSourceImpl } from './infrastructure/data-sources/post.remote.datasource.impl';
import { IPostLocalDataSource } from './infrastructure/data-sources/post.local.datasource.interface';
import { PostLocalDataSourceImpl } from './infrastructure/data-sources/post.local.datasource.impl';
import { IGroupRemoteDataSource } from './infrastructure/data-sources/group.remote.datasource.interface';
import { GroupRemoteDataSourceImpl } from './infrastructure/data-sources/group.remote.datasource.impl';
import { IGroupLocalDataSource } from './infrastructure/data-sources/group.local.datasource.interface';
import { GroupLocalDataSourceImpl } from './infrastructure/data-sources/group.local.datasource.impl';
import { IChallengeRemoteDataSource } from './infrastructure/data-sources/challenge.remote.datasource.interface';
import { ChallengeRemoteDataSourceImpl } from './infrastructure/data-sources/challenge.remote.datasource.impl';
import { IChallengeLocalDataSource } from './infrastructure/data-sources/challenge.local.datasource.interface';
import { ChallengeLocalDataSourceImpl } from './infrastructure/data-sources/challenge.local.datasource.impl';
import { CreatePostUseCase } from './application/create-post.use-case';
import { GetPostUseCase } from './application/get-post.use-case';
import { DeletePostUseCase } from './application/delete-post.use-case';
import { ListPostsUseCase } from './application/list-posts.use-case';
import { LikePostUseCase } from './application/like-post.use-case';
import { AddCommentUseCase } from './application/add-comment.use-case';
import { ListCommentsUseCase } from './application/list-comments.use-case';
import { CreateGroupUseCase } from './application/create-group.use-case';
import { ListGroupsUseCase } from './application/list-groups.use-case';
import { GetGroupUseCase } from './application/get-group.use-case';
import { JoinGroupUseCase } from './application/join-group.use-case';
import { LeaveGroupUseCase } from './application/leave-group.use-case';
import { ListGroupMembersUseCase } from './application/list-group-members.use-case';
import { GetFeedUseCase } from './application/get-feed.use-case';
import { CreateChallengeUseCase } from './application/create-challenge.use-case';
import { ListChallengesUseCase } from './application/list-challenges.use-case';
import { GetChallengeUseCase } from './application/get-challenge.use-case';
import { JoinChallengeUseCase } from './application/join-challenge.use-case';
import { LeaveChallengeUseCase } from './application/leave-challenge.use-case';
import { ListChallengeMembersUseCase } from './application/list-challenge-members.use-case';
import { GetChallengeProgressUseCase } from './application/get-challenge-progress.use-case';
import { CompleteChallengeUseCase } from './application/complete-challenge.use-case';

@Module({
  imports: [PrismaModule, RedisModule, ProfileModule],
  controllers: [PostController, GroupController, ChallengeController],
  providers: [
    CreatePostUseCase,
    GetFeedUseCase,
    GetPostUseCase,
    DeletePostUseCase,
    ListPostsUseCase,
    LikePostUseCase,
    AddCommentUseCase,
    ListCommentsUseCase,
    CreateGroupUseCase,
    ListGroupsUseCase,
    GetGroupUseCase,
    JoinGroupUseCase,
    LeaveGroupUseCase,
    ListGroupMembersUseCase,
    CreateChallengeUseCase,
    ListChallengesUseCase,
    GetChallengeUseCase,
    JoinChallengeUseCase,
    LeaveChallengeUseCase,
    ListChallengeMembersUseCase,
    GetChallengeProgressUseCase,
    CompleteChallengeUseCase,
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
    {
      provide: IGroupRepository,
      useClass: GroupRepositoryImpl,
    },
    {
      provide: IGroupRemoteDataSource,
      useClass: GroupRemoteDataSourceImpl,
    },
    {
      provide: IGroupLocalDataSource,
      useClass: GroupLocalDataSourceImpl,
    },
    {
      provide: IChallengeRepository,
      useClass: ChallengeRepositoryImpl,
    },
    {
      provide: IChallengeRemoteDataSource,
      useClass: ChallengeRemoteDataSourceImpl,
    },
    {
      provide: IChallengeLocalDataSource,
      useClass: ChallengeLocalDataSourceImpl,
    },
  ],
  exports: [IPostRepository, IGroupRepository, IChallengeRepository],
})
export class CommunityModule {}
