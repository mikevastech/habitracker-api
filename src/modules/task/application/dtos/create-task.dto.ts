import {
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
  IsDate,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskType } from '../../domain/entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ description: 'User ID (set server-side)' })
  userId!: string;

  @ApiProperty({ minLength: 1, maxLength: 200, example: 'Morning run' })
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ enum: TaskType })
  @IsEnum(TaskType)
  taskType!: TaskType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iconName?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  colorValue?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  notes?: string[];

  @ApiPropertyOptional({ description: 'Habit: target value' })
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
  unitId?: string;

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
  startTime?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  dueTime?: Date;

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
  url?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  affirmation?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

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
