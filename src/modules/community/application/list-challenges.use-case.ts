import { Inject, Injectable } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import type { ListChallengesOptions } from '../domain/repositories/challenge.repository.interface';

@Injectable()
export class ListChallengesUseCase {
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(options: { groupId?: string; userId?: string; limit: number; cursor?: string }) {
    const opts: ListChallengesOptions = {
      limit: options.limit,
      cursor: options.cursor,
    };
    if (options.groupId) opts.groupId = options.groupId;
    if (options.userId) opts.userId = options.userId;
    return this.challengeRepository.list(opts);
  }
}
