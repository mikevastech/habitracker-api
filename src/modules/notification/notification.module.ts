import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { RedisModule } from '../../shared/infrastructure/redis/redis.module';
import { NotificationController } from './presentation/notification.controller';
import { INotificationRepository } from './domain/repositories/notification.repository.interface';
import { NotificationRepositoryImpl } from './infrastructure/repositories/notification.repository.impl';
import { INotificationRemoteDataSource } from './infrastructure/data-sources/notification.remote.datasource.interface';
import { NotificationRemoteDataSourceImpl } from './infrastructure/data-sources/notification.remote.datasource.impl';
import { INotificationLocalDataSource } from './infrastructure/data-sources/notification.local.datasource.interface';
import { NotificationLocalDataSourceImpl } from './infrastructure/data-sources/notification.local.datasource.impl';
import { ListNotificationsUseCase } from './application/list-notifications.use-case';
import { MarkNotificationReadUseCase } from './application/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from './application/mark-all-notifications-read.use-case';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [NotificationController],
  providers: [
    ListNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    {
      provide: INotificationRepository,
      useClass: NotificationRepositoryImpl,
    },
    {
      provide: INotificationRemoteDataSource,
      useClass: NotificationRemoteDataSourceImpl,
    },
    {
      provide: INotificationLocalDataSource,
      useClass: NotificationLocalDataSourceImpl,
    },
  ],
  exports: [INotificationRepository],
})
export class NotificationModule {}
