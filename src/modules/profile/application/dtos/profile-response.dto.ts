import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionTier, PostVisibility } from '../../domain/entities/profile.entity';

export class ProfileSettingsResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  isSearchable!: boolean;

  @ApiProperty()
  analyticsEnabled!: boolean;

  @ApiProperty({ enum: PostVisibility })
  profileVisibility!: PostVisibility;

  @ApiProperty({ enum: PostVisibility })
  challengeVisibility!: PostVisibility;

  @ApiProperty({ enum: PostVisibility })
  challengePostVisibility!: PostVisibility;

  @ApiPropertyOptional()
  taskDailyReminderTime!: string | null;

  @ApiProperty()
  taskWeekStartDay!: number;

  @ApiProperty()
  taskArchiveVisible!: boolean;

  @ApiProperty()
  pomodoroFocusDuration!: number;

  @ApiProperty()
  pomodoroBreakDuration!: number;

  @ApiProperty()
  pomodoroLongBreakDuration!: number;
}

export class HabitProfileResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty({ enum: SubscriptionTier })
  subscriptionTier!: SubscriptionTier;

  @ApiPropertyOptional()
  bio!: string | null;

  @ApiProperty()
  points!: number;

  @ApiProperty()
  isTaggingAllowed!: boolean;

  @ApiPropertyOptional()
  avatarUrl?: string | null;

  @ApiPropertyOptional()
  followerCount?: number;

  @ApiPropertyOptional()
  followingCount?: number;
}

export class PaginatedProfilesResponseDto {
  @ApiProperty({ type: [HabitProfileResponseDto] })
  items!: HabitProfileResponseDto[];

  @ApiPropertyOptional()
  nextCursor?: string;
}

export class CheckUsernameResponseDto {
  @ApiProperty()
  available!: boolean;
}

export class GetMeResponseDto {
  @ApiProperty()
  user!: {
    id: string;
    email: string;
    name: string | null;
    lastName: string | null;
    image: string | null;
  };

  @ApiProperty({ type: HabitProfileResponseDto })
  profile!: HabitProfileResponseDto;
}

export class SuggestionsResponseDto {
  @ApiProperty({ type: [HabitProfileResponseDto] })
  suggestions!: HabitProfileResponseDto[];
}
