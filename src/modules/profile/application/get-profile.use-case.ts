import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import { HabitProfileEntity } from '../domain/entities/profile.entity';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface GetProfileParams {
  userId: string;
}

@Injectable()
export class GetProfileUseCase implements IUseCase<HabitProfileEntity | null, GetProfileParams> {
  constructor(
    @Inject(IProfileRepository)
    private profileRepository: IProfileRepository,
  ) {}

  async execute(params: GetProfileParams): Promise<HabitProfileEntity | null> {
    return this.profileRepository.findByUserId(params.userId);
  }
}
