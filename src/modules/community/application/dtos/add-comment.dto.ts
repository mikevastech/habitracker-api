import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty({ maxLength: 5000, example: 'Great progress!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content!: string;
}
