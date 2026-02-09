import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { HabitProfileEntity } from '../domain/entities/profile.entity';

export class UpdateProfileDto {
  username?: string;
  bio?: string;
  isTaggingAllowed?: boolean;
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(IProfileRepository)
    private profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<HabitProfileEntity> {
    const data: Partial<HabitProfileEntity> = {
      username: dto.username,
      bio: dto.bio,
      isTaggingAllowed: dto.isTaggingAllowed,
    };

    return this.profileRepository.update(userId, data);
  }
}
