import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { TaskController } from './presentation/task.controller';
import { ReferenceController } from './presentation/reference.controller';
import { CreateTaskUseCase } from './application/create-task.use-case';
import { ListTasksUseCase } from './application/list-tasks.use-case';
import { GetTaskUseCase } from './application/get-task.use-case';
import { UpdateTaskUseCase } from './application/update-task.use-case';
import { DeleteTaskUseCase } from './application/delete-task.use-case';
import { LogCompletionUseCase } from './application/log-completion.use-case';
import { ListCompletionsUseCase } from './application/list-completions.use-case';
import { GetCategoriesUseCase } from './application/get-categories.use-case';
import { GetUnitsUseCase } from './application/get-units.use-case';
import { GetTaskTemplatesUseCase } from './application/get-task-templates.use-case';
import { ITaskRepository } from './domain/repositories/task.repository.interface';
import { IReferenceRepository } from './domain/repositories/reference.repository.interface';
import { ITaskLocalDataSource } from './infrastructure/data-sources/task.local.datasource.interface';
import { TaskLocalDataSourceImpl } from './infrastructure/data-sources/task.local.datasource.impl';
import { ITaskRemoteDataSource } from './infrastructure/data-sources/task.remote.datasource.interface';
import { TaskRemoteDataSourceImpl } from './infrastructure/data-sources/task.remote.datasource.impl';
import { IReferenceLocalDataSource } from './infrastructure/data-sources/reference.local.datasource.interface';
import { ReferenceLocalDataSourceImpl } from './infrastructure/data-sources/reference.local.datasource.impl';
import { IReferenceRemoteDataSource } from './infrastructure/data-sources/reference.remote.datasource.interface';
import { ReferenceRemoteDataSourceImpl } from './infrastructure/data-sources/reference.remote.datasource.impl';
import { TaskRepositoryImpl } from './infrastructure/repositories/task.repository.impl';
import { ReferenceRepositoryImpl } from './infrastructure/repositories/reference.repository.impl';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TaskController, ReferenceController],
  providers: [
    CreateTaskUseCase,
    ListTasksUseCase,
    GetTaskUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    LogCompletionUseCase,
    ListCompletionsUseCase,
    GetCategoriesUseCase,
    GetUnitsUseCase,
    GetTaskTemplatesUseCase,
    {
      provide: ITaskLocalDataSource,
      useClass: TaskLocalDataSourceImpl,
    },
    {
      provide: ITaskRemoteDataSource,
      useClass: TaskRemoteDataSourceImpl,
    },
    {
      provide: ITaskRepository,
      useClass: TaskRepositoryImpl,
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
