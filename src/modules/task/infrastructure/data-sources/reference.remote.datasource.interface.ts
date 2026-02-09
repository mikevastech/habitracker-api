import { CategoryEntity, TaskUnitEntity } from '../../domain/entities/reference.entity';
import type { TaskTemplateItem } from '../../domain/repositories/reference.repository.interface';

export interface IReferenceRemoteDataSource {
  findPredefinedCategories(): Promise<CategoryEntity[]>;
  findPredefinedUnits(): Promise<TaskUnitEntity[]>;
  findPredefinedTaskTemplates(): Promise<TaskTemplateItem[]>;
}

export const IReferenceRemoteDataSource = Symbol('IReferenceRemoteDataSource');
