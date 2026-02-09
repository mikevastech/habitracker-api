import { Injectable } from '@nestjs/common';
import { AppPrismaService } from '../../../../shared/infrastructure/prisma/app-prisma.service';
import {
  GroupEntity,
  GroupMemberEntity,
  GroupMemberRole,
} from '../../domain/entities/community.entity';
import { IGroupRemoteDataSource } from './group.remote.datasource.interface';
import type { ListGroupsOptions } from '../../domain/repositories/group.repository.interface';

function toGroupEntity(row: {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  isPublic: boolean;
  allowMemberInvites: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: { members: number };
}): GroupEntity {
  return new GroupEntity({
    id: row.id,
    name: row.name,
    description: row.description,
    coverImageUrl: row.coverImageUrl,
    profileImageUrl: row.profileImageUrl,
    isPublic: row.isPublic,
    allowMemberInvites: row.allowMemberInvites,
    memberCount: row._count?.members,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toMemberEntity(row: {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  joinedAt: Date;
}): GroupMemberEntity {
  return new GroupMemberEntity({
    id: row.id,
    groupId: row.groupId,
    userId: row.userId,
    role: row.role as GroupMemberRole,
    joinedAt: row.joinedAt,
  });
}

@Injectable()
export class GroupRemoteDataSourceImpl implements IGroupRemoteDataSource {
  constructor(private prisma: AppPrismaService) {}

  async create(data: Partial<GroupEntity> & { creatorUserId: string }): Promise<GroupEntity> {
    const { creatorUserId, ...groupData } = data;
    const group = await this.prisma.group.create({
      data: {
        name: groupData.name!,
        description: groupData.description ?? null,
        coverImageUrl: groupData.coverImageUrl ?? null,
        profileImageUrl: groupData.profileImageUrl ?? null,
        isPublic: groupData.isPublic ?? true,
        allowMemberInvites: groupData.allowMemberInvites ?? true,
        members: {
          create: {
            userId: creatorUserId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });
    return toGroupEntity(group);
  }

  async findById(id: string): Promise<GroupEntity | null> {
    const row = await this.prisma.group.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });
    return row ? toGroupEntity(row) : null;
  }

  async list(options: ListGroupsOptions): Promise<{ items: GroupEntity[]; nextCursor?: string }> {
    const { publicOnly, mineOnly, userId, limit, cursor } = options;
    const take = limit + 1;

    const where: { isPublic?: boolean; members?: { some: { userId: string } } } = {};
    if (publicOnly) where.isPublic = true;
    if (mineOnly && userId) where.members = { some: { userId } };

    const rows = await this.prisma.group.findMany({
      where,
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { members: true } } },
    });

    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;
    return {
      items: items.map(toGroupEntity),
      nextCursor,
    };
  }

  async addMember(groupId: string, userId: string, role: string): Promise<GroupMemberEntity> {
    const member = await this.prisma.groupMember.create({
      data: { groupId, userId, role: role || 'MEMBER' },
    });
    return toMemberEntity(member);
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    await this.prisma.groupMember.deleteMany({
      where: { groupId, userId },
    });
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.groupMember.count({
      where: { groupId, userId },
    });
    return count > 0;
  }

  async listMembers(
    groupId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: GroupMemberEntity[]; nextCursor?: string }> {
    const take = limit + 1;
    const rows = await this.prisma.groupMember.findMany({
      where: { groupId },
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: { joinedAt: 'asc' },
    });
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const nextCursor = hasNext ? items[items.length - 1].id : undefined;
    return {
      items: items.map(toMemberEntity),
      nextCursor,
    };
  }
}
