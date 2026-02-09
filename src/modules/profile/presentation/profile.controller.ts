import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { CurrentUser } from '../../../shared/infrastructure/auth/decorators/current-user.decorator';
import { GetProfileUseCase } from '../application/get-profile.use-case';
import { UpdateProfileUseCase, UpdateProfileDto } from '../application/update-profile.use-case';
import type { AuthenticatedUser } from '../../../shared/domain/auth.types';

@Controller('profile')
@UseGuards(SessionGuard)
export class ProfileController {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get('me')
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
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(user.id, dto);
  }
}
