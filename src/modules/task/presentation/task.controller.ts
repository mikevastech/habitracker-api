import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
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
import { CreateTaskUseCase } from '../application/create-task.use-case';
import { ListTasksUseCase } from '../application/list-tasks.use-case';
import { GetTaskUseCase } from '../application/get-task.use-case';
import { UpdateTaskUseCase } from '../application/update-task.use-case';
import { DeleteTaskUseCase } from '../application/delete-task.use-case';
import { LogCompletionUseCase } from '../application/log-completion.use-case';
import { CreateTaskDto } from '../application/dtos/create-task.dto';
import { UpdateTaskDto } from '../application/dtos/update-task.dto';
import { LogCompletionDto } from '../application/dtos/log-completion.dto';
import { ListCompletionsUseCase } from '../application/list-completions.use-case';
import type { TaskType } from '../domain/entities/task.entity';
import {
  TaskResponseDto,
  TaskCompletionResponseDto,
  PaginatedTasksResponseDto,
  PaginatedCompletionsResponseDto,
} from '../application/dtos/task-response.dto';

@ApiTags('tasks')
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
  @ApiCreatedResponse({ type: TaskResponseDto })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Omit<CreateTaskDto, 'userId'>,
  ) {
    const dto: CreateTaskDto = { ...body, userId: user.id };
    return this.createTaskUseCase.execute(dto);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedTasksResponseDto })
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
      cursor: cursor ?? undefined,
      taskType: type,
      includeDeleted: includeDeleted || undefined,
    });
  }

  @Post(':id/completions')
  @ApiCreatedResponse({ type: TaskCompletionResponseDto })
  async logCompletion(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Body() dto: LogCompletionDto,
  ) {
    return this.logCompletionUseCase.execute({ taskId, userId: user.id, dto });
  }

  @Get(':id/completions')
  @ApiOkResponse({ type: PaginatedCompletionsResponseDto })
  async listCompletions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') taskId: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listCompletionsUseCase.execute({
      taskId,
      userId: user.id,
      limit,
      cursor,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: TaskResponseDto })
  async getOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.getTaskUseCase.execute({ taskId: id, userId: user.id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: TaskResponseDto })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.updateTaskUseCase.execute({ taskId: id, userId: user.id, dto });
  }

  @Delete(':id')
  @ApiNoContentResponse()
  async delete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.deleteTaskUseCase.execute({ taskId: id, userId: user.id });
  }
}
