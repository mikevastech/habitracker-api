import { Injectable, Inject } from '@nestjs/common';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';
import { IProfileLocalDataSource } from '../data-sources/profile.local.datasource.interface';
import { IProfileRemoteDataSource } from '../data-sources/profile.remote.datasource.interface';
import { HabitProfileEntity } from '../../domain/entities/profile.entity';

@Injectable()
export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(
    @Inject(IProfileLocalDataSource)
    private localDataSource: IProfileLocalDataSource,
    @Inject(IProfileRemoteDataSource)
    private remoteDataSource: IProfileRemoteDataSource,
  ) {}

  async findByUserId(userId: string): Promise<HabitProfileEntity | null> {
    // 1. Check Cache
    const cached = await this.localDataSource.getCachedProfile(userId);
    if (cached) return cached;

    // 2. Fetch Remote
    const remote = await this.remoteDataSource.findByUserId(userId);

    // 3. Cache it
    if (remote) {
      await this.localDataSource.setCachedProfile(userId, remote);
    }

    return remote;
  }

  async findByUsername(username: string): Promise<HabitProfileEntity | null> {
    // Usually used for uniqueness checks, go direct to remote or implement specific cache if needed
    return this.remoteDataSource.findByUsername(username);
  }

  async update(userId: string, data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity> {
    const updated = await this.remoteDataSource.update(userId, data);
    await this.localDataSource.setCachedProfile(userId, updated);
    return updated;
  }

  async create(data: Partial<HabitProfileEntity>): Promise<HabitProfileEntity> {
    const created = await this.remoteDataSource.create(data);
    await this.localDataSource.setCachedProfile(created.userId, created);
    return created;
  }
}
