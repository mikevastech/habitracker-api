import { Inject, Injectable } from '@nestjs/common';
import { IGroupRepository } from '../domain/repositories/group.repository.interface';
import type { ListGroupsOptions } from '../domain/repositories/group.repository.interface';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';
import type { Paginated } from '../../../shared/domain/paginated.types';
import type { GroupEntity } from '../domain/entities/community.entity';

export interface ListGroupsParams {
  publicOnly?: boolean;
  mineOnly?: boolean;
  userId?: string;
  limit: number;
  cursor?: string;
}

@Injectable()
export class ListGroupsUseCase
  implements IUseCase<Paginated<GroupEntity>, ListGroupsParams>
{
  constructor(
    @Inject(IGroupRepository)
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(params: ListGroupsParams): Promise<Paginated<GroupEntity>> {
    const opts: ListGroupsOptions = {
      limit: params.limit,
      cursor: params.cursor,
    };
    if (params.publicOnly) opts.publicOnly = true;
    if (params.mineOnly && params.userId) {
      opts.mineOnly = true;
      opts.userId = params.userId;
    }
    return this.groupRepository.list(opts);
  }
}
