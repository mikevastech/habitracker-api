import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AchievementDefinitionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description!: string | null;

  @ApiProperty()
  pointsDefault!: number;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  sortOrder!: number;
}

export class RewardEventResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  achievementDefinitionId!: string;

  @ApiProperty()
  pointsAwarded!: number;

  @ApiPropertyOptional()
  sourceType!: string | null;

  @ApiPropertyOptional()
  sourceId!: string | null;

  @ApiPropertyOptional()
  title!: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export class PaginatedRewardEventsResponseDto {
  @ApiProperty({ type: [RewardEventResponseDto] })
  items!: RewardEventResponseDto[];

  @ApiPropertyOptional()
  nextCursor?: string;
}

export class UserAchievementProgressResponseDto {
  @ApiProperty()
  achievementDefinitionId!: string;

  @ApiProperty()
  countEarned!: number;

  @ApiPropertyOptional()
  lastEarnedAt!: Date | null;
}
