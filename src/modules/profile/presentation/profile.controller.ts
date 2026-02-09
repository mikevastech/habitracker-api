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
import { ApiTags } from '@nestjs/swagger';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import { GetProfileUseCase } from '../application/get-profile.use-case';
import { UpdateProfileUseCase, UpdateProfileDto } from '../application/update-profile.use-case';
import { GetProfileSettingsUseCase } from '../application/get-profile-settings.use-case';
import {
  UpdateProfileSettingsUseCase,
  UpdateProfileSettingsDto,
} from '../application/update-profile-settings.use-case';
import { FollowUserUseCase } from '../application/follow-user.use-case';
import { UnfollowUserUseCase } from '../application/unfollow-user.use-case';
import { ListFollowersUseCase } from '../application/list-followers.use-case';
import { ListFollowingUseCase } from '../application/list-following.use-case';
import { CheckUsernameUseCase } from '../application/check-username.use-case';
import { GetSuggestedUsersUseCase } from '../application/get-suggested-users.use-case';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getProfileSettingsUseCase: GetProfileSettingsUseCase,
    private readonly updateProfileSettingsUseCase: UpdateProfileSettingsUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly listFollowersUseCase: ListFollowersUseCase,
    private readonly listFollowingUseCase: ListFollowingUseCase,
    private readonly checkUsernameUseCase: CheckUsernameUseCase,
    private readonly getSuggestedUsersUseCase: GetSuggestedUsersUseCase,
  ) {}

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    const isAvailable = await this.checkUsernameUseCase.execute(username);
    return { available: isAvailable };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.getProfileUseCase.execute(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      profile,
    };
  }

  @Patch('me')
  @UseGuards(SessionGuard)
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(user.id, dto);
  }

  @Get('me/settings')
  @UseGuards(SessionGuard)
  async getMySettings(@CurrentUser() user: AuthenticatedUser) {
    return this.getProfileSettingsUseCase.execute(user.id);
  }

  @Patch('me/settings')
  @UseGuards(SessionGuard)
  async updateMySettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileSettingsDto,
  ) {
    return this.updateProfileSettingsUseCase.execute(user.id, dto);
  }

  @Get('me/followers')
  @UseGuards(SessionGuard)
  async getMyFollowers(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listFollowersUseCase.execute(user.id, limit, cursor);
  }

  @Get('me/following')
  @UseGuards(SessionGuard)
  async getMyFollowing(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listFollowingUseCase.execute(user.id, limit, cursor);
  }

  @Post('me/following/:userId')
  @UseGuards(SessionGuard)
  async follow(@CurrentUser() user: AuthenticatedUser, @Param('userId') targetUserId: string) {
    return this.followUserUseCase.execute(user.id, targetUserId);
  }

  @Delete('me/following/:userId')
  @UseGuards(SessionGuard)
  async unfollow(@CurrentUser() user: AuthenticatedUser, @Param('userId') targetUserId: string) {
    await this.unfollowUserUseCase.execute(user.id, targetUserId);
  }

  @Get('me/suggestions')
  @UseGuards(SessionGuard)
  async getMySuggestions(@CurrentUser() user: AuthenticatedUser) {
    const profiles = await this.getSuggestedUsersUseCase.execute(user.id);
    return { suggestions: profiles };
  }
}
