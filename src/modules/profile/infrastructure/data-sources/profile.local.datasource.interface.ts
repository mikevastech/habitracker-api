import { HabitProfileEntity } from '../../domain/entities/profile.entity';

export interface IProfileLocalDataSource {
  getCachedProfile(userId: string): Promise<HabitProfileEntity | null>;
  setCachedProfile(userId: string, profile: HabitProfileEntity): Promise<void>;
  deleteCachedProfile(userId: string): Promise<void>;
}

export const IProfileLocalDataSource = Symbol('IProfileLocalDataSource');
