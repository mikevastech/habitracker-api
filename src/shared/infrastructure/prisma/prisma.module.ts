import { Global, Module } from '@nestjs/common';
import { AuthPrismaService } from './auth-prisma.service';
import { AppPrismaService } from './app-prisma.service';

@Global()
@Module({
  providers: [AuthPrismaService, AppPrismaService],
  exports: [AuthPrismaService, AppPrismaService],
})
export class PrismaModule {}
