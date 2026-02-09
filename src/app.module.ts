import { Module, type CanActivate, type Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { RedisModule } from './shared/infrastructure/redis/redis.module';
import { ProfileModule } from './modules/profile/profile.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommunityModule } from './modules/community/community.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10_000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60_000,
        limit: 200,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    TaskModule,
    ProfileModule,
    CommunityModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard as unknown as Type<CanActivate>,
    },
  ],
})
export class AppModule {}
