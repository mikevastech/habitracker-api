import { ImageUploadResult } from '../../domain/upload-result';

export interface UploadOptions {
  folder?: string;
  /** Optional prefix for public_id (e.g. "avatars", "posts"). */
  publicIdPrefix?: string;
}

export interface IImageUploadDataSource {
  /**
   * Upload image buffer to remote storage (e.g. Cloudinary).
   * @param buffer File buffer
   * @param mimetype e.g. image/jpeg
   * @param originalName Original filename (for extension)
   * @param options Optional folder and publicId prefix
   */
  upload(
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    options?: UploadOptions,
  ): Promise<ImageUploadResult>;
}

export const IImageUploadDataSource = Symbol('IImageUploadDataSource');
