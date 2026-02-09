import { Inject, Injectable } from '@nestjs/common';
import { IProfileRepository } from '../domain/repositories/profile.repository.interface';

@Injectable()
export class CheckUsernameUseCase {
  constructor(
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
  ) {}

  /**
   * Returns true if the username is available (i.e. not taken), false otherwise.
   */
  async execute(username: string): Promise<boolean> {
    const profile = await this.profileRepository.findByUsername(username);
    return !profile;
  }
}
