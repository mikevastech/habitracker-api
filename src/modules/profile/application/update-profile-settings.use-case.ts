import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { ProfileSettingsEntity } from '../domain/entities/profile.entity';

export type UpdateProfileSettingsDto = Partial<
  Pick<
    ProfileSettingsEntity,
    | 'isSearchable'
    | 'analyticsEnabled'
    | 'profileVisibility'
    | 'challengeVisibility'
    | 'challengePostVisibility'
    | 'taskDailyReminderTime'
    | 'taskWeekStartDay'
    | 'taskArchiveVisible'
    | 'pomodoroFocusDuration'
    | 'pomodoroBreakDuration'
    | 'pomodoroLongBreakDuration'
  >
>;

@Injectable()
export class UpdateProfileSettingsUseCase {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileSettingsDto): Promise<ProfileSettingsEntity> {
    const existing = await this.profileRepository.getSettings(userId);
    if (!existing) {
      await this.profileRepository.createSettings(userId);
    }
    return this.profileRepository.updateSettings(userId, dto);
  }
}
