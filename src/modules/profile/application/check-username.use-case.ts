import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface CheckUsernameParams {
  username: string;
}

@Injectable()
export class CheckUsernameUseCase implements IUseCase<boolean, CheckUsernameParams> {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  /** Returns true if the username is available (i.e. not taken), false otherwise. */
  async execute(params: CheckUsernameParams): Promise<boolean> {
    const profile = await this.profileRepository.findByUsername(params.username);
    return !profile;
  }
}
