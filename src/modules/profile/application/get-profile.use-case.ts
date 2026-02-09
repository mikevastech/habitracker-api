import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { HabitProfileEntity } from '../domain/entities/profile.entity';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(IProfileRepository)
    private profileRepository: IProfileRepository,
  ) {}

  async execute(userId: string): Promise<HabitProfileEntity | null> {
    return this.profileRepository.findByUserId(userId);
  }
}
