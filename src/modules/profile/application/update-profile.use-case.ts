import { Inject, Injectable } from '@nestjs/common';
import { IsOptional, IsString, IsBoolean, IsUrl, MaxLength, MinLength } from 'class-validator';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { HabitProfileEntity } from '../domain/entities/profile.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsBoolean()
  isTaggingAllowed?: boolean;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string | null;
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
      avatarUrl: dto.avatarUrl,
    };

    return this.profileRepository.update(userId, data);
  }
}
