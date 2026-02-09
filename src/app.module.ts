import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { TaskModule } from './task.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
