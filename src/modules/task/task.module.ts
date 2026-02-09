import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TaskController } from './presentation/task.controller';
import { ReferenceController } from './presentation/reference.controller';
import { CreateTaskUseCase } from './application/create-task.use-case';
import { GetCategoriesUseCase } from './application/get-categories.use-case';
import { GetUnitsUseCase } from './application/get-units.use-case';
import { GetTaskTemplatesUseCase } from './application/get-task-templates.use-case';
import { ITaskRepository } from './domain/repositories/task.repository.interface';
import { IReferenceRepository } from './domain/repositories/reference.repository.interface';
import { IReferenceLocalDataSource } from './infrastructure/data-sources/reference.local.datasource.interface';
import { ReferenceLocalDataSourceImpl } from './infrastructure/data-sources/reference.local.datasource.impl';
import { IReferenceRemoteDataSource } from './infrastructure/data-sources/reference.remote.datasource.interface';
import { ReferenceRemoteDataSourceImpl } from './infrastructure/data-sources/reference.remote.datasource.impl';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository';
import { ReferenceRepositoryImpl } from './infrastructure/repositories/reference.repository.impl';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TaskController, ReferenceController],
  providers: [
    CreateTaskUseCase,
    GetCategoriesUseCase,
    GetUnitsUseCase,
    GetTaskTemplatesUseCase,
    {
      provide: ITaskRepository,
      useClass: PrismaTaskRepository,
    },
    {
      provide: IReferenceLocalDataSource,
      useClass: ReferenceLocalDataSourceImpl,
    },
    {
      provide: IReferenceRemoteDataSource,
      useClass: ReferenceRemoteDataSourceImpl,
    },
    {
      provide: IReferenceRepository,
      useClass: ReferenceRepositoryImpl,
    },
  ],
  exports: [ITaskRepository],
})
export class TaskModule {}
