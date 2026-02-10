import { Inject, Injectable } from '@nestjs/common';
import { IChallengeRepository } from '../domain/repositories/challenge.repository.interface';
import type { ListChallengesOptions } from '../domain/repositories/challenge.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

export interface ListChallengesParams {
  groupId?: string;
  userId?: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListChallengesUseCase
  implements IUseCase<
    Awaited<ReturnType<IChallengeRepository['list']>>,
    ListChallengesParams
  >
{
  constructor(
    @Inject(IChallengeRepository)
    private readonly challengeRepository: IChallengeRepository,
  ) {}

  async execute(params: ListChallengesParams) {
    const opts: ListChallengesOptions = {
      limit: params.limit,
      cursor: params.cursor,
    };
    if (params.groupId) opts.groupId = params.groupId;
    if (params.userId) opts.userId = params.userId;
    return this.challengeRepository.list(opts);
  }
}
