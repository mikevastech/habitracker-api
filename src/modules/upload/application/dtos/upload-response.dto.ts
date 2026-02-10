import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty()
  url!: string;

  @ApiProperty()
  publicId!: string;
}
