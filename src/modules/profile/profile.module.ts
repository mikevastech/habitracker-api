import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ProfileController } from './presentation/profile.controller';
import { GetProfileUseCase } from './application/get-profile.use-case';
import { UpdateProfileUseCase } from './application/update-profile.use-case';
import { GetProfileSettingsUseCase } from './application/get-profile-settings.use-case';
import { UpdateProfileSettingsUseCase } from './application/update-profile-settings.use-case';
import { FollowUserUseCase } from './application/follow-user.use-case';
import { UnfollowUserUseCase } from './application/unfollow-user.use-case';
import { ListFollowersUseCase } from './application/list-followers.use-case';
import { ListFollowingUseCase } from './application/list-following.use-case';
import { CheckUsernameUseCase } from './application/check-username.use-case';
import { GetSuggestedUsersUseCase } from './application/get-suggested-users.use-case';
import { SuggestionsComputeService } from './application/suggestions-compute.service';
import { IProfileRepository } from './domain/repositories/profile.repository.interface';
import { ProfileRepositoryImpl } from './infrastructure/repositories/profile.repository.impl';
import { IProfileLocalDataSource } from './infrastructure/data-sources/profile.local.datasource.interface';
import { ProfileLocalDataSourceImpl } from './infrastructure/data-sources/profile.local.datasource.impl';
import { IProfileRemoteDataSource } from './infrastructure/data-sources/profile.remote.datasource.interface';
import { ProfileRemoteDataSourceImpl } from './infrastructure/data-sources/profile.remote.datasource.impl';
import { IFollowLocalDataSource } from './infrastructure/data-sources/follow.local.datasource.interface';
import { FollowLocalDataSourceImpl } from './infrastructure/data-sources/follow.local.datasource.impl';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProfileController],
  providers: [
    {
      provide: IFollowLocalDataSource,
      useClass: FollowLocalDataSourceImpl,
    },
    GetProfileUseCase,
    UpdateProfileUseCase,
    GetProfileSettingsUseCase,
    UpdateProfileSettingsUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    ListFollowersUseCase,
    ListFollowingUseCase,
    CheckUsernameUseCase,
    SuggestionsComputeService,
    GetSuggestedUsersUseCase,
    {
      provide: IProfileLocalDataSource,
      useClass: ProfileLocalDataSourceImpl,
    },
    {
      provide: IProfileRemoteDataSource,
      useClass: ProfileRemoteDataSourceImpl,
    },
    {
      provide: IProfileRepository,
      useClass: ProfileRepositoryImpl,
    },
  ],
  exports: [IProfileRepository, IFollowLocalDataSource, SuggestionsComputeService],
})
export class ProfileModule {}
