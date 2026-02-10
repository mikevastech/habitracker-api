import { Injectable, Inject } from '@nestjs/common';
import type {
  IReferenceRepository,
  CreateCategoryData,
  CreateUnitData,
} from '../../domain/repositories/reference.repository.interface';
import { IReferenceLocalDataSource } from '../data-sources/reference.local.datasource.interface';
import { IReferenceRemoteDataSource } from '../data-sources/reference.remote.datasource.interface';

@Injectable()
export class ReferenceRepositoryImpl implements IReferenceRepository {
  constructor(
    @Inject(IReferenceLocalDataSource)
    private readonly localDataSource: IReferenceLocalDataSource,
    @Inject(IReferenceRemoteDataSource)
    private readonly remoteDataSource: IReferenceRemoteDataSource,
  ) {}

  async findPredefinedCategories() {
    const cached = await this.localDataSource.getCachedCategories();
    if (cached) return cached;
    const data = await this.remoteDataSource.findPredefinedCategories();
    await this.localDataSource.setCachedCategories(data);
    return data;
  }

  async findPredefinedUnits() {
    const cached = await this.localDataSource.getCachedUnits();
    if (cached) return cached;
    const data = await this.remoteDataSource.findPredefinedUnits();
    await this.localDataSource.setCachedUnits(data);
    return data;
  }

  async findCategoriesForUser(userId: string) {
    return this.remoteDataSource.findCategoriesForUser(userId);
  }

  async findUnitsForUser(userId: string) {
    return this.remoteDataSource.findUnitsForUser(userId);
  }

  async findPredefinedTaskTemplates() {
    const cached = await this.localDataSource.getCachedTaskTemplates();
    // If cache exists and is not empty, return it
    // If cache is empty array, ignore it and fetch from database (cache might be stale)
    if (cached && cached.length > 0) {
      return cached;
    }
    // Fetch from database
    const data = await this.remoteDataSource.findPredefinedTaskTemplates();
    // Cache the result (even if empty, to avoid repeated DB queries)
    await this.localDataSource.setCachedTaskTemplates(data);
    return data;
  }

  async createCategory(userId: string, data: CreateCategoryData) {
    return this.remoteDataSource.createCategory(userId, data);
  }

  async createUnit(userId: string, data: CreateUnitData) {
    return this.remoteDataSource.createUnit(userId, data);
  }
}
