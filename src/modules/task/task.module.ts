import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TaskController } from './presentation/task.controller';
import { ReferenceController } from './presentation/reference.controller';
import { CreateTaskUseCase } from './application/create-task.use-case';
import { ITaskRepository } from './domain/repositories/task.repository.interface';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TaskController, ReferenceController],
  providers: [
    CreateTaskUseCase,
    {
      provide: ITaskRepository,
      useClass: PrismaTaskRepository,
    },
  ],
  exports: [ITaskRepository],
})
export class TaskModule {}
