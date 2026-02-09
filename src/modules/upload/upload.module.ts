import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './presentation/upload.controller';
import { UploadImageUseCase } from './application/upload-image.use-case';
import { IImageUploadDataSource } from './infrastructure/data-sources/image-upload.datasource.interface';
import { CloudinaryUploadDataSourceImpl } from './infrastructure/data-sources/cloudinary-upload.datasource.impl';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    UploadImageUseCase,
    {
      provide: IImageUploadDataSource,
      useClass: CloudinaryUploadDataSourceImpl,
    },
  ],
  exports: [IImageUploadDataSource],
})
export class UploadModule {}
