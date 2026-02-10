import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { HabitProfileEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { UpdateProfileDto } from './dtos/update-profile.dto';

export interface UpdateProfileParams {
  userId: string;
  dto: UpdateProfileDto;
}

@Injectable()
export class UpdateProfileUseCase implements IUseCase<HabitProfileEntity, UpdateProfileParams> {
  constructor(
    @Inject(IProfileRepository)
    private profileRepository: IProfileRepository,
  ) {}

  async execute(params: UpdateProfileParams): Promise<HabitProfileEntity> {
    const data: Partial<HabitProfileEntity> = {
      username: params.dto.username,
      bio: params.dto.bio,
      isTaggingAllowed: params.dto.isTaggingAllowed,
      avatarUrl: params.dto.avatarUrl,
    };
    return this.profileRepository.update(params.userId, data);
  }
}
