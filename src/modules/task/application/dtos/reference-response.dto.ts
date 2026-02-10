import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  iconName!: string | null;

  @ApiPropertyOptional()
  colorValue!: number | null;

  @ApiPropertyOptional()
  imageUrl!: string | null;

  @ApiProperty()
  isPredefined!: boolean;
}

export class UnitResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  symbol!: string;

  @ApiProperty()
  isPredefined!: boolean;
}
