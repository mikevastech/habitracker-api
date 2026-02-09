import { TaskEntity } from '../entities/task.entity';
import { CategoryEntity, TaskUnitEntity } from '../entities/reference.entity';

export interface TaskTemplateItem {
  task: TaskEntity;
  category: CategoryEntity | null;
}

export interface IReferenceRepository {
  findPredefinedCategories(): Promise<CategoryEntity[]>;
  findPredefinedUnits(): Promise<TaskUnitEntity[]>;
  findPredefinedTaskTemplates(): Promise<TaskTemplateItem[]>;
}

export const IReferenceRepository = Symbol('IReferenceRepository');
