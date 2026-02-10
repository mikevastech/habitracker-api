import { TaskEntity } from '../entities/task.entity';
import { CategoryEntity, TaskUnitEntity } from '../entities/reference.entity';

export interface TaskTemplateItem {
  task: TaskEntity;
  category: CategoryEntity | null;
}

export interface CreateCategoryData {
  name: string;
  iconName?: string | null;
  colorValue?: number | null;
  imageUrl?: string | null;
}

export interface CreateUnitData {
  name: string;
  symbol: string;
}

export interface IReferenceRepository {
  findPredefinedCategories(): Promise<CategoryEntity[]>;
  findPredefinedUnits(): Promise<TaskUnitEntity[]>;
  findCategoriesForUser(userId: string): Promise<CategoryEntity[]>;
  findUnitsForUser(userId: string): Promise<TaskUnitEntity[]>;
  findPredefinedTaskTemplates(): Promise<TaskTemplateItem[]>;
  createCategory(userId: string, data: CreateCategoryData): Promise<CategoryEntity>;
  createUnit(userId: string, data: CreateUnitData): Promise<TaskUnitEntity>;
}

export const IReferenceRepository = Symbol('IReferenceRepository');
