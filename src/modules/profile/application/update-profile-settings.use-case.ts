import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { ProfileSettingsEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { UpdateProfileSettingsDto } from './dtos/update-profile-settings.dto';

export interface UpdateProfileSettingsParams {
  userId: string;
  dto: UpdateProfileSettingsDto;
}

@Injectable()
export class UpdateProfileSettingsUseCase
  implements IUseCase<ProfileSettingsEntity, UpdateProfileSettingsParams>
{
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(params: UpdateProfileSettingsParams): Promise<ProfileSettingsEntity> {
    const existing = await this.profileRepository.getSettings(params.userId);
    if (!existing) {
      await this.profileRepository.createSettings(params.userId);
    }
    return this.profileRepository.updateSettings(params.userId, params.dto);
  }
}
