import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { RedisModule } from '../../shared/infrastructure/redis/redis.module';
import { GamificationController } from './presentation/gamification.controller';
import { IGamificationRepository } from './domain/repositories/gamification.repository.interface';
import { GamificationRepositoryImpl } from './infrastructure/repositories/gamification.repository.impl';
import { IGamificationRemoteDataSource } from './infrastructure/data-sources/gamification.remote.datasource.interface';
import { GamificationRemoteDataSourceImpl } from './infrastructure/data-sources/gamification.remote.datasource.impl';
import { IGamificationLocalDataSource } from './infrastructure/data-sources/gamification.local.datasource.interface';
import { GamificationLocalDataSourceImpl } from './infrastructure/data-sources/gamification.local.datasource.impl';
import { ListRewardEventsUseCase } from './application/list-reward-events.use-case';
import { ListAchievementDefinitionsUseCase } from './application/list-achievement-definitions.use-case';
import { GetUserAchievementProgressUseCase } from './application/get-user-achievement-progress.use-case';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [GamificationController],
  providers: [
    ListRewardEventsUseCase,
    ListAchievementDefinitionsUseCase,
    GetUserAchievementProgressUseCase,
    {
      provide: IGamificationRepository,
      useClass: GamificationRepositoryImpl,
    },
    {
      provide: IGamificationRemoteDataSource,
      useClass: GamificationRemoteDataSourceImpl,
    },
    {
      provide: IGamificationLocalDataSource,
      useClass: GamificationLocalDataSourceImpl,
    },
  ],
  exports: [IGamificationRepository],
})
export class GamificationModule {}
