import { Inject, Injectable } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import type { ListGroupsOptions } from '../domain/repositories/group.repository.interface';

@Injectable()
export class ListGroupsUseCase {
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(options: {
    publicOnly?: boolean;
    mineOnly?: boolean;
    userId?: string;
    limit: number;
    cursor?: string;
  }): Promise<{
    items: Awaited<ReturnType<IGroupRepository['list']>>['items'];
    nextCursor?: string;
  }> {
    const opts: ListGroupsOptions = {
      limit: options.limit,
      cursor: options.cursor,
    };
    if (options.publicOnly) opts.publicOnly = true;
    if (options.mineOnly && options.userId) {
      opts.mineOnly = true;
      opts.userId = options.userId;
    }
    return this.groupRepository.list(opts);
  }
}
