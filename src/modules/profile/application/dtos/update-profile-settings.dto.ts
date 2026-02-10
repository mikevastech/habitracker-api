import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostVisibility } from '../../domain/entities/profile.entity';

export class UpdateProfileSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isSearchable?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  analyticsEnabled?: boolean;

  @ApiPropertyOptional({ enum: PostVisibility })
  @IsOptional()
  @IsEnum(PostVisibility)
  profileVisibility?: PostVisibility;

  @ApiPropertyOptional({ enum: PostVisibility })
  @IsOptional()
  @IsEnum(PostVisibility)
  challengeVisibility?: PostVisibility;

  @ApiPropertyOptional({ enum: PostVisibility })
  @IsOptional()
  @IsEnum(PostVisibility)
  challengePostVisibility?: PostVisibility;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taskDailyReminderTime?: string | null;

  @ApiPropertyOptional({ minimum: 0, maximum: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  taskWeekStartDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  taskArchiveVisible?: boolean;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pomodoroFocusDuration?: number;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pomodoroBreakDuration?: number;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pomodoroLongBreakDuration?: number;
}
