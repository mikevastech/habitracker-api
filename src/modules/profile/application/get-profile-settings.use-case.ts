import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { ProfileSettingsEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetProfileSettingsParams {
  userId: string;
}

@Injectable()
export class GetProfileSettingsUseCase
  implements IUseCase<ProfileSettingsEntity, GetProfileSettingsParams>
{
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(params: GetProfileSettingsParams): Promise<ProfileSettingsEntity> {
    let settings = await this.profileRepository.getSettings(params.userId);
    if (!settings) {
      settings = await this.profileRepository.createSettings(params.userId);
    }
    return settings;
  }
}
