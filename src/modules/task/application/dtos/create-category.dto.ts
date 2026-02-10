import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Health' })
  @IsString()
  @IsNotEmpty()
  name!: string;

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
}
