import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { CreateGroupUseCase } from '../application/create-group.use-case';
import { CreateGroupDto } from '../application/dtos/create-group.dto';
import { ListGroupsUseCase } from '../application/list-groups.use-case';
import { GetGroupUseCase } from '../application/get-group.use-case';
import { JoinGroupUseCase } from '../application/join-group.use-case';
import { LeaveGroupUseCase } from '../application/leave-group.use-case';
import { ListGroupMembersUseCase } from '../application/list-group-members.use-case';
import {
  GroupResponseDto,
  GroupMemberResponseDto,
  PaginatedGroupsResponseDto,
  PaginatedGroupMembersResponseDto,
} from '../application/dtos/community-response.dto';

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
  @ApiCreatedResponse({ type: GroupResponseDto })
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
  @ApiOkResponse({ type: PaginatedGroupsResponseDto })
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
  @ApiOkResponse({ type: GroupResponseDto })
  async getById(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.getGroupUseCase.execute({
      groupId: id,
      requireMember: true,
      userId: user?.id,
    });
  }

  @Post(':id/join')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: GroupMemberResponseDto })
  async join(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.joinGroupUseCase.execute({ groupId: id, userId: user.id });
  }

  @Delete(':id/members/me')
  @UseGuards(SessionGuard)
  @ApiNoContentResponse()
  async leave(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.leaveGroupUseCase.execute({ groupId: id, userId: user.id });
  }

  @Get(':id/members')
  @ApiOkResponse({ type: PaginatedGroupMembersResponseDto })
  async listMembers(
    @Param('id') id: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listGroupMembersUseCase.execute({
      groupId: id,
      limit,
      cursor,
      userId: user?.id,
    });
  }
}
