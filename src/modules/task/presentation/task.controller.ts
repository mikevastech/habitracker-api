import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { CreateTaskUseCase, CreateTaskDto } from '../application/create-task.use-case';
import { ListTasksUseCase } from '../application/list-tasks.use-case';
import { GetTaskUseCase } from '../application/get-task.use-case';
import { UpdateTaskUseCase, UpdateTaskDto } from '../application/update-task.use-case';
import { DeleteTaskUseCase } from '../application/delete-task.use-case';
import { LogCompletionUseCase, LogCompletionDto } from '../application/log-completion.use-case';
import { ListCompletionsUseCase } from '../application/list-completions.use-case';
import { TaskType } from '../domain/entities/task.entity';

@Controller('tasks')
@UseGuards(SessionGuard)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly listTasksUseCase: ListTasksUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly logCompletionUseCase: LogCompletionUseCase,
    private readonly listCompletionsUseCase: ListCompletionsUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Omit<CreateTaskDto, 'userId'>,
  ) {
    const dto: CreateTaskDto = { ...body, userId: user.id };
    return this.createTaskUseCase.execute(dto);
  }

  @Get()
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @Query('type') type?: TaskType,
    @Query('includeDeleted') includeDeletedStr?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    const includeDeleted = includeDeletedStr === 'true' || includeDeletedStr === '1';
    return this.listTasksUseCase.execute({
      userId: user.id,
      limit,
      cursor: cursor || undefined,
      taskType: type,
      includeDeleted: includeDeleted || undefined,
    });
  }

  @Post(':id/completions')
  async logCompletion(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() dto: LogCompletionDto,
  ) {
    return this.logCompletionUseCase.execute(taskId, user.id, dto);
  }

  @Get(':id/completions')
  async listCompletions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listCompletionsUseCase.execute(taskId, user.id, limit, cursor);
  }

  @Get(':id')
  async getOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.getTaskUseCase.execute(id, user.id);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.updateTaskUseCase.execute(id, user.id, dto);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.deleteTaskUseCase.execute(id, user.id);
  }
}
