import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { ProfileSettingsEntity } from '../domain/entities/profile.entity';

@Injectable()
export class GetProfileSettingsUseCase {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string): Promise<ProfileSettingsEntity> {
    let settings = await this.profileRepository.getSettings(userId);
    if (!settings) {
      settings = await this.profileRepository.createSettings(userId);
    }
    return settings;
  }
}
