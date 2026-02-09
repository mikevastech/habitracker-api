import { GroupEntity } from '../../domain/entities/community.entity';

export interface IGroupLocalDataSource {
  getCachedGroup(id: string): Promise<GroupEntity | null>;
  setCachedGroup(id: string, group: GroupEntity): Promise<void>;
  deleteCachedGroup(id: string): Promise<void>;

  getCachedList(key: string): Promise<{ items: GroupEntity[]; nextCursor?: string } | null>;
  setCachedList(
    key: string,
    data: { items: GroupEntity[]; nextCursor?: string },
    ttlSeconds: number,
  ): Promise<void>;
}

export const IGroupLocalDataSource = Symbol('IGroupLocalDataSource');
