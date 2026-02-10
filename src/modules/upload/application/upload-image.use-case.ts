import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  IImageUploadDataSource,
  type UploadOptions,
} from '../infrastructure/data-sources/image-upload.datasource.interface';
import { ImageUploadResult } from '../domain/upload-result';
import type { IUseCase } from '../../../shared/domain/ports/use-case.port';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface UploadImageParams {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  options?: UploadOptions;
}

@Injectable()
export class UploadImageUseCase implements IUseCase<ImageUploadResult, UploadImageParams> {
  constructor(
    @Inject(IImageUploadDataSource)
    private readonly imageUpload: IImageUploadDataSource,
  ) {}

  async execute(params: UploadImageParams): Promise<ImageUploadResult> {
    if (!params.buffer?.length) {
      throw new BadRequestException('No file provided');
    }
    if (params.buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File too large. Max size: ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
      );
    }
    if (!ALLOWED_MIMES.includes(params.mimetype)) {
      throw new BadRequestException(`Unsupported file type. Allowed: ${ALLOWED_MIMES.join(', ')}`);
    }
    return this.imageUpload.upload(
      params.buffer,
      params.mimetype,
      params.originalname,
      params.options,
    );
  }
}
