import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { IImageUploadDataSource } from './image-upload.datasource.interface';
import type { UploadOptions } from './image-upload.datasource.interface';
import { ImageUploadResult } from '../../domain/upload-result';

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

function getExtension(originalName: string, mimetype: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase();
  if (ext && /^[a-z0-9]+$/.test(ext)) return ext;
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  };
  return map[mimetype] ?? 'jpg';
}

@Injectable()
export class CloudinaryUploadDataSourceImpl implements IImageUploadDataSource {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    options?: UploadOptions,
  ): Promise<ImageUploadResult> {
    if (!ALLOWED_MIMES.has(mimetype)) {
      throw new Error(`Unsupported image type: ${mimetype}`);
    }
    const ext = getExtension(originalName, mimetype);
    const publicIdPrefix = options?.publicIdPrefix ?? 'habitracker';
    const unique = `${publicIdPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    return new Promise((resolve, reject) => {
      const uploadOptions: Record<string, unknown> = {
        resource_type: 'image',
        public_id: unique,
        folder: options?.folder,
      };
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
        if (err) return reject(new Error(err.message));
        if (!result || !result.secure_url) {
          return reject(new Error('Upload failed: no result'));
        }
        resolve({
          url: result.url ?? result.secure_url,
          secureUrl: result.secure_url,
          publicId: result.public_id ?? unique,
        });
      });
      stream.end(buffer);
    });
  }
}
