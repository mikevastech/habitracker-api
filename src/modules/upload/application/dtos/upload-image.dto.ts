import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/** Optional body fields for POST /upload/image (file is in form field "file"). */
export class UploadImageBodyDto {
  @ApiPropertyOptional({ description: 'Cloudinary folder path' })
  @IsOptional()
  @IsString()
  folder?: string;

  @ApiPropertyOptional({ description: 'Prefix for public_id' })
  @IsOptional()
  @IsString()
  publicIdPrefix?: string;
}
