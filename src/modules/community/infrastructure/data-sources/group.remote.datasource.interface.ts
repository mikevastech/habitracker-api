import { GroupEntity, GroupMemberEntity } from '../../domain/entities/community.entity';
import type { ListGroupsOptions } from '../../domain/repositories/group.repository.interface';

export interface IGroupRemoteDataSource {
  create(data: Partial<GroupEntity> & { creatorUserId: string }): Promise<GroupEntity>;
  findById(id: string): Promise<GroupEntity | null>;
  list(options: ListGroupsOptions): Promise<{ items: GroupEntity[]; nextCursor?: string }>;

  addMember(groupId: string, userId: string, role: string): Promise<GroupMemberEntity>;
  removeMember(groupId: string, userId: string): Promise<void>;
  isMember(groupId: string, userId: string): Promise<boolean>;

  listMembers(
    groupId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: GroupMemberEntity[]; nextCursor?: string }>;
}

export const IGroupRemoteDataSource = Symbol('IGroupRemoteDataSource');
