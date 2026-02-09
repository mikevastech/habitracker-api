import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ProfileController } from './presentation/profile.controller';
import { GetProfileUseCase } from './application/get-profile.use-case';
import { UpdateProfileUseCase } from './application/update-profile.use-case';
import { CheckUsernameUseCase } from './application/check-username.use-case';
import { IProfileRepository } from './domain/repositories/profile.repository.interface';
import { ProfileRepositoryImpl } from './infrastructure/repositories/profile.repository.impl';
import { IProfileLocalDataSource } from './infrastructure/data-sources/profile.local.datasource.interface';
import { ProfileLocalDataSourceImpl } from './infrastructure/data-sources/profile.local.datasource.impl';
import { IProfileRemoteDataSource } from './infrastructure/data-sources/profile.remote.datasource.interface';
import { ProfileRemoteDataSourceImpl } from './infrastructure/data-sources/profile.remote.datasource.impl';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProfileController],
  providers: [
    GetProfileUseCase,
    UpdateProfileUseCase,
    CheckUsernameUseCase,
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
  exports: [IProfileRepository],
})
export class ProfileModule {}
