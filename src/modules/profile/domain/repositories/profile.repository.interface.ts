import { HabitProfileEntity } from '../entities/profile.entity';

export interface IProfileRepository {
  findByUserId(userId: string): Promise<HabitProfileEntity | null>;
  findByUsername(username: string): Promise<HabitProfileEntity | null>;
  update(userId: string, data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity>;
  create(data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity>;
}

export const IProfileRepository = Symbol('IProfileRepository');
