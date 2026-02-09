export class CategoryEntity {
  id!: string;
  name!: string;
  iconName!: string | null;
  colorValue!: number | null;
  imageUrl!: string | null;
  userId!: string | null;
  isPredefined!: boolean;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}

export class TaskUnitEntity {
  id!: string;
  name!: string;
  symbol!: string;
  userId!: string | null;
  isPredefined!: boolean;

  constructor(partial: Partial<TaskUnitEntity>) {
    Object.assign(this, partial);
  }
}
