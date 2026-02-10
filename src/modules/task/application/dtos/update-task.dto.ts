import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iconName?: string | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  colorValue?: number | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  endDate?: Date | null;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  notes?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  goalValue?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  currentValue?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unitId?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  direction?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  steps?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startTime?: string | null;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  dueTime?: Date | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFlagged?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  url?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  affirmation?: string | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  durationMinutes?: number | null;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  reminders?: any[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  subtasks?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  frequency?: {
    type: string;
    daysOfWeek?: number[];
    dayOfMonth?: number | null;
    interval?: number;
    timesPerPeriod?: number;
    endDate?: Date;
  };

  @ApiPropertyOptional()
  @IsOptional()
  pomodoroSettings?: {
    focusDuration?: number;
    breakDuration?: number;
    longBreakDuration?: number;
    totalSessions?: number;
    isEnabled?: boolean;
    autoStartBreaks?: boolean;
    autoStartFocus?: boolean;
  };
}
