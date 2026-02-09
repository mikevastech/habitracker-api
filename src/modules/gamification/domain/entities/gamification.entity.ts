export class AchievementDefinitionEntity {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
  pointsDefault!: number;
  isActive!: boolean;
  sortOrder!: number;

  constructor(partial: Partial<AchievementDefinitionEntity>) {
    Object.assign(this, partial);
  }
}

export class RewardEventEntity {
  id!: string;
  userId!: string;
  achievementDefinitionId!: string;
  pointsAwarded!: number;
  sourceType!: string | null;
  sourceId!: string | null;
  title!: string | null;
  createdAt!: Date;

  constructor(partial: Partial<RewardEventEntity>) {
    Object.assign(this, partial);
  }
}
