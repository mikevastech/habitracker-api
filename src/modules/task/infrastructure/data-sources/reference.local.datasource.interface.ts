import { CategoryEntity, TaskUnitEntity } from '../../domain/entities/reference.entity';
import type { TaskTemplateItem } from '../../domain/repositories/reference.repository.interface';

export interface IReferenceLocalDataSource {
  getCachedCategories(): Promise<CategoryEntity[] | null>;
  setCachedCategories(categories: CategoryEntity[]): Promise<void>;

  getCachedUnits(): Promise<TaskUnitEntity[] | null>;
  setCachedUnits(units: TaskUnitEntity[]): Promise<void>;

  getCachedTaskTemplates(): Promise<TaskTemplateItem[] | null>;
  setCachedTaskTemplates(templates: TaskTemplateItem[]): Promise<void>;
}

export const IReferenceLocalDataSource = Symbol('IReferenceLocalDataSource');
