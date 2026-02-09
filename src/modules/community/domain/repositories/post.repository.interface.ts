import { PostEntity } from '../entities/community.entity';

export interface IPostRepository {
  findById(id: string): Promise<PostEntity | null>;
  findByIds(ids: string[]): Promise<PostEntity[]>;
  create(post: Partial<PostEntity>): Promise<PostEntity>;
  update(id: string, post: Partial<PostEntity>): Promise<PostEntity>;
  delete(id: string): Promise<void>;
  list(options: {
    userId?: string;
    groupId?: string;
    limit: number;
    cursor?: string;
    visibility?: string;
  }): Promise<{ items: PostEntity[]; nextCursor?: string }>;
  like(postId: string, userId: string): Promise<void>;
  unlike(postId: string, userId: string): Promise<void>;
  addComment(postId: string, userId: string, content: string): Promise<void>;
  listComments(
    postId: string,
    limit: number,
    cursor?: string,
  ): Promise<{ items: any[]; nextCursor?: string }>;
}

export const IPostRepository = Symbol('IPostRepository');
