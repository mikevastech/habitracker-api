import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { CreateGroupUseCase, CreateGroupDto } from '../application/create-group.use-case';
import { ListGroupsUseCase } from '../application/list-groups.use-case';
import { GetGroupUseCase } from '../application/get-group.use-case';
import { JoinGroupUseCase } from '../application/join-group.use-case';
import { LeaveGroupUseCase } from '../application/leave-group.use-case';
import { ListGroupMembersUseCase } from '../application/list-group-members.use-case';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly listGroupsUseCase: ListGroupsUseCase,
    private readonly getGroupUseCase: GetGroupUseCase,
    private readonly joinGroupUseCase: JoinGroupUseCase,
    private readonly leaveGroupUseCase: LeaveGroupUseCase,
    private readonly listGroupMembersUseCase: ListGroupMembersUseCase,
  ) {}

  @Post()
  @UseGuards(SessionGuard)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Omit<CreateGroupDto, 'userId'>,
  ) {
    return this.createGroupUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get()
  async list(
    @Query('public') publicOnlyStr?: string,
    @Query('mine') mineOnlyStr?: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    const publicOnly = publicOnlyStr === 'true' || publicOnlyStr === '1';
    const mineOnly = mineOnlyStr === 'true' || mineOnlyStr === '1';
    return this.listGroupsUseCase.execute({
      publicOnly: publicOnly || undefined,
      mineOnly: mineOnly || undefined,
      userId: user?.id,
      limit,
      cursor,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.getGroupUseCase.execute(id, {
      requireMember: true,
      userId: user?.id,
    });
  }

  @Post(':id/join')
  @UseGuards(SessionGuard)
  async join(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.joinGroupUseCase.execute(id, user.id);
  }

  @Delete(':id/members/me')
  @UseGuards(SessionGuard)
  async leave(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.leaveGroupUseCase.execute(id, user.id);
  }

  @Get(':id/members')
  async listMembers(
    @Param('id') id: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listGroupMembersUseCase.execute(id, limit, cursor, {
      userId: user?.id,
    });
  }
}
