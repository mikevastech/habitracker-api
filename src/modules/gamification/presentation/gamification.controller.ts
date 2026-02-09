import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import { ListRewardEventsUseCase } from '../application/list-reward-events.use-case';
import { ListAchievementDefinitionsUseCase } from '../application/list-achievement-definitions.use-case';
import { GetUserAchievementProgressUseCase } from '../application/get-user-achievement-progress.use-case';

@ApiTags('gamification')
@Controller('gamification')
export class GamificationController {
  constructor(
    private readonly listRewardEventsUseCase: ListRewardEventsUseCase,
    private readonly listAchievementDefinitionsUseCase: ListAchievementDefinitionsUseCase,
    private readonly getUserAchievementProgressUseCase: GetUserAchievementProgressUseCase,
  ) {}

  /** Reward event history for current user. Points balance is on GET /profile/me. */
  @Get('rewards')
  @UseGuards(SessionGuard)
  async listMyRewardEvents(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listRewardEventsUseCase.execute(user.id, limit, cursor);
  }

  /** All achievement definitions (public, cached). */
  @Get('achievements')
  async listAchievementDefinitions() {
    return this.listAchievementDefinitionsUseCase.execute();
  }

  /** Current user's progress per achievement (count earned, last earned). */
  @Get('achievements/progress')
  @UseGuards(SessionGuard)
  async getMyAchievementProgress(@CurrentUser() user: AuthenticatedUser) {
    return this.getUserAchievementProgressUseCase.execute(user.id);
  }
}
