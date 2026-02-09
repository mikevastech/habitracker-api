import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { HabitProfileEntity } from '../../domain/entities/profile.entity';
import { IProfileLocalDataSource } from './profile.local.datasource.interface';

@Injectable()
export class ProfileLocalDataSourceImpl implements IProfileLocalDataSource {
  private readonly CACHE_PREFIX = 'profile:';
  private readonly TTL = 3600;

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getCachedProfile(userId: string): Promise<HabitProfileEntity | null> {
    const data = await this.redis.get(`${this.CACHE_PREFIX}${userId}`);
    if (!data) return null;
    const parsed = JSON.parse(data) as Partial<HabitProfileEntity>;
    return parsed && typeof parsed.userId === 'string' ? new HabitProfileEntity(parsed) : null;
  }

  async setCachedProfile(userId: string, profile: HabitProfileEntity): Promise<void> {
    await this.redis.set(`${this.CACHE_PREFIX}${userId}`, JSON.stringify(profile), 'EX', this.TTL);
  }

  async deleteCachedProfile(userId: string): Promise<void> {
    await this.redis.del(`${this.CACHE_PREFIX}${userId}`);
  }
}
