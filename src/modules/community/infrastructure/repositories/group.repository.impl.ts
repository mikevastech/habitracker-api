import { Injectable, Inject } from '@nestjs/common';
import { IGroupRepository } from '../../domain/repositories/group.repository.interface';
import { GroupEntity, GroupMemberEntity } from '../../domain/entities/community.entity';
import { IGroupLocalDataSource } from '../data-sources/group.local.datasource.interface';
import { IGroupRemoteDataSource } from '../data-sources/group.remote.datasource.interface';

@Injectable()
export class GroupRepositoryImpl implements IGroupRepository {
  constructor(
    @Inject(IGroupLocalDataSource)
    private readonly local: IGroupLocalDataSource,
    @Inject(IGroupRemoteDataSource)
    private readonly remote: IGroupRemoteDataSource,
  ) {}

  async create(data: Partial<GroupEntity> & { creatorUserId: string }): Promise<GroupEntity> {
    const created = await this.remote.create(data);
    await this.local.setCachedGroup(created.id, created);
    return created;
  }

  async findById(id: string): Promise<GroupEntity | null> {
    const cached = await this.local.getCachedGroup(id);
    if (cached) return cached;
    const remote = await this.remote.findById(id);
    if (remote) await this.local.setCachedGroup(id, remote);
    return remote;
  }

  async list(
    options: import('../../domain/repositories/group.repository.interface').ListGroupsOptions,
  ): Promise<{ items: GroupEntity[]; nextCursor?: string }> {
    const cacheKey = `pub${options.publicOnly ?? false}:mine${options.mineOnly ?? false}:u${options.userId ?? ''}:lim${options.limit}:cur${options.cursor ?? 'start'}`;
    const cached = await this.local.getCachedList(cacheKey);
    if (cached) return cached;
    const result = await this.remote.list(options);
    await this.local.setCachedList(cacheKey, result, 60);
    return result;
  }

  async join(
    groupId: string,
    userId: string,
    role: 'ADMIN' | 'MEMBER' = 'MEMBER',
  ): Promise<GroupMemberEntity> {
    const member = await this.remote.addMember(groupId, userId, role);
    await this.local.deleteCachedGroup(groupId);
    return member;
  }

  async leave(groupId: string, userId: string): Promise<void> {
    await this.remote.removeMember(groupId, userId);
    await this.local.deleteCachedGroup(groupId);
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    return this.remote.isMember(groupId, userId);
  }

  async listMembers(
    groupId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: GroupMemberEntity[]; nextCursor?: string }> {
    return this.remote.listMembers(groupId, limit, cursor);
  }
}
