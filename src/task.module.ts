import { Module } from '@nestjs/common';
import { ITaskRepository } from './core/repositories/task.repository.interface';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { TaskController } from './presentation/controllers/task.controller';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
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
