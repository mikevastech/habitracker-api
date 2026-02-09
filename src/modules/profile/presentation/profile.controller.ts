import { Body, Controller, Get, Patch, UseGuards, Query } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import { GetProfileUseCase } from '../application/get-profile.use-case';
import { UpdateProfileUseCase, UpdateProfileDto } from '../application/update-profile.use-case';
import { CheckUsernameUseCase } from '../application/check-username.use-case';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';

@Controller('profile')
export class ProfileController {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
    private checkUsernameUseCase: CheckUsernameUseCase,
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
}
