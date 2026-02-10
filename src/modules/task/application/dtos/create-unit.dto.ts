import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ example: 'Kilometers' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'km' })
  @IsString()
  @IsNotEmpty()
  symbol!: string;
}
