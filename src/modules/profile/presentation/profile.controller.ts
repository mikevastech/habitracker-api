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
import { ApiTags, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import { GetProfileUseCase } from '../application/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/update-profile.use-case';
import { GetProfileSettingsUseCase } from '../application/get-profile-settings.use-case';
import { UpdateProfileSettingsUseCase } from '../application/update-profile-settings.use-case';
import { UpdateProfileDto } from '../application/dtos/update-profile.dto';
import { UpdateProfileSettingsDto } from '../application/dtos/update-profile-settings.dto';
import { FollowUserUseCase } from '../application/follow-user.use-case';
import { UnfollowUserUseCase } from '../application/unfollow-user.use-case';
import { ListFollowersUseCase } from '../application/list-followers.use-case';
import { ListFollowingUseCase } from '../application/list-following.use-case';
import { CheckUsernameUseCase } from '../application/check-username.use-case';
import { GetSuggestedUsersUseCase } from '../application/get-suggested-users.use-case';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';
import {
  ProfileSettingsResponseDto,
  HabitProfileResponseDto,
  PaginatedProfilesResponseDto,
  CheckUsernameResponseDto,
  GetMeResponseDto,
  SuggestionsResponseDto,
} from '../application/dtos/profile-response.dto';

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
  @ApiOkResponse({ type: CheckUsernameResponseDto })
  async checkUsername(@Query('username') username: string) {
    const isAvailable = await this.checkUsernameUseCase.execute({ username });
    return { available: isAvailable };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: GetMeResponseDto })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.getProfileUseCase.execute({ userId: user.id });

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
  @ApiOkResponse({ type: HabitProfileResponseDto })
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute({ userId: user.id, dto });
  }

  @Get('me/settings')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: ProfileSettingsResponseDto })
  async getMySettings(@CurrentUser() user: AuthenticatedUser) {
    return this.getProfileSettingsUseCase.execute({ userId: user.id });
  }

  @Patch('me/settings')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: ProfileSettingsResponseDto })
  async updateMySettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileSettingsDto,
  ) {
    return this.updateProfileSettingsUseCase.execute({ userId: user.id, dto });
  }

  @Get('me/followers')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: PaginatedProfilesResponseDto })
  async getMyFollowers(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listFollowersUseCase.execute({ profileId: user.id, limit, cursor });
  }

  @Get('me/following')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: PaginatedProfilesResponseDto })
  async getMyFollowing(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limit = Math.min(Math.max(parseInt(limitStr ?? '20', 10) || 20, 1), 100);
    return this.listFollowingUseCase.execute({ profileId: user.id, limit, cursor });
  }

  @Post('me/following/:userId')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: HabitProfileResponseDto })
  async follow(@CurrentUser() user: AuthenticatedUser, @Param('userId') targetUserId: string) {
    return this.followUserUseCase.execute({ followerId: user.id, followingId: targetUserId });
  }

  @Delete('me/following/:userId')
  @UseGuards(SessionGuard)
  @ApiNoContentResponse()
  async unfollow(@CurrentUser() user: AuthenticatedUser, @Param('userId') targetUserId: string) {
    await this.unfollowUserUseCase.execute({ followerId: user.id, followingId: targetUserId });
  }

  @Get('me/suggestions')
  @UseGuards(SessionGuard)
  @ApiOkResponse({ type: SuggestionsResponseDto })
  async getMySuggestions(@CurrentUser() user: AuthenticatedUser) {
    const profiles = await this.getSuggestedUsersUseCase.execute({ userId: user.id });
    return { suggestions: profiles };
  }
}
