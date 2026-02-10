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
    if (cached) return cached;
    const data = await this.remoteDataSource.findPredefinedTaskTemplates();
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
