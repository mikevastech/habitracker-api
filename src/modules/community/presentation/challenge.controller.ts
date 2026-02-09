import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import {
  CreateChallengeUseCase,
  CreateChallengeDto,
} from '../application/create-challenge.use-case';
import { ListChallengesUseCase } from '../application/list-challenges.use-case';
import { GetChallengeUseCase } from '../application/get-challenge.use-case';
import { JoinChallengeUseCase } from '../application/join-challenge.use-case';
import { LeaveChallengeUseCase } from '../application/leave-challenge.use-case';
import { ListChallengeMembersUseCase } from '../application/list-challenge-members.use-case';
import { GetChallengeProgressUseCase } from '../application/get-challenge-progress.use-case';
import { CompleteChallengeUseCase } from '../application/complete-challenge.use-case';

@Controller('challenges')
export class ChallengeController {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly listChallengesUseCase: ListChallengesUseCase,
    private readonly getChallengeUseCase: GetChallengeUseCase,
    private readonly joinChallengeUseCase: JoinChallengeUseCase,
    private readonly leaveChallengeUseCase: LeaveChallengeUseCase,
    private readonly listChallengeMembersUseCase: ListChallengeMembersUseCase,
    private readonly getChallengeProgressUseCase: GetChallengeProgressUseCase,
    private readonly completeChallengeUseCase: CompleteChallengeUseCase,
  ) {}

  @Post()
  @UseGuards(SessionGuard)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: Omit<CreateChallengeDto, 'userId'>,
  ) {
    return this.createChallengeUseCase.execute({
      ...body,
      userId: user.id,
    });
  }

  @Get()
  async list(
    @Query('groupId') groupId?: string,
    @Query('userId') userId?: string,
    @Query('mine') mineStr?: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    const mine = mineStr === 'true' || mineStr === '1';
    return this.listChallengesUseCase.execute({
      groupId,
      userId: mine && user?.id ? user.id : userId,
      limit,
      cursor,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getChallengeUseCase.execute(id);
  }

  @Post(':id/join')
  @UseGuards(SessionGuard)
  async join(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.joinChallengeUseCase.execute(id, user.id);
  }

  @Delete(':id/members/me')
  @UseGuards(SessionGuard)
  async leave(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.leaveChallengeUseCase.execute(id, user.id);
  }

  @Get(':id/members')
  async listMembers(
    @Param('id') id: string,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listChallengeMembersUseCase.execute(id, limit, cursor);
  }

  @Get(':id/progress')
  @UseGuards(SessionGuard)
  async getMyProgress(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.getChallengeProgressUseCase.execute(id, user.id);
  }

  @Post(':id/complete')
  @UseGuards(SessionGuard)
  async complete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    await this.completeChallengeUseCase.execute(id, user.id);
  }
}
