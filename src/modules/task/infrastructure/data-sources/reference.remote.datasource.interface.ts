import { CategoryEntity, TaskUnitEntity } from '../../domain/entities/reference.entity';
import type {
  TaskTemplateItem,
  CreateCategoryData,
  CreateUnitData,
} from '../../domain/repositories/reference.repository.interface';

export interface IReferenceRemoteDataSource {
  findPredefinedCategories(): Promise<CategoryEntity[]>;
  findPredefinedUnits(): Promise<TaskUnitEntity[]>;
  findPredefinedTaskTemplates(): Promise<TaskTemplateItem[]>;
  createCategory(userId: string, data: CreateCategoryData): Promise<CategoryEntity>;
  createUnit(userId: string, data: CreateUnitData): Promise<TaskUnitEntity>;
}

export const IReferenceRemoteDataSource = Symbol('IReferenceRemoteDataSource');
