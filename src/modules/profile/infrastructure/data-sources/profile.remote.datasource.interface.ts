import { HabitProfileEntity } from '../../domain/entities/profile.entity';

export interface IProfileRemoteDataSource {
  findByUserId(userId: string): Promise<HabitProfileEntity | null>;
  findByUsername(username: string): Promise<HabitProfileEntity | null>;
  update(userId: string, data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity>;
  create(data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity>;
}

export const IProfileRemoteDataSource = Symbol('IProfileRemoteDataSource');
