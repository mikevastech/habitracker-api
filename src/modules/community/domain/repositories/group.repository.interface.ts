import { GroupEntity, GroupMemberEntity } from '../entities/community.entity';

export interface ListGroupsOptions {
  /** If true, only public groups. */
  publicOnly?: boolean;
  /** If true, only groups where userId is member. Requires userId. */
  mineOnly?: boolean;
  userId?: string;
  limit: number;
  cursor?: string;
}

export interface IGroupRepository {
  create(data: Partial<GroupEntity> & { creatorUserId: string }): Promise<GroupEntity>;
  findById(id: string): Promise<GroupEntity | null>;
  list(options: ListGroupsOptions): Promise<{ items: GroupEntity[]; nextCursor?: string }>;

  join(groupId: string, userId: string, role?: 'ADMIN' | 'MEMBER'): Promise<GroupMemberEntity>;
  leave(groupId: string, userId: string): Promise<void>;
  isMember(groupId: string, userId: string): Promise<boolean>;

  listMembers(
    groupId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: GroupMemberEntity[]; nextCursor?: string }>;
}

export const IGroupRepository = Symbol('IGroupRepository');
