import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';
import { UploadImageUseCase } from '../application/upload-image.use-case';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Controller('upload')
@UseGuards(SessionGuard)
export class UploadController {
  constructor(private readonly uploadImageUseCase: UploadImageUseCase) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadImage(
    @UploadedFile() file: { buffer: Buffer; mimetype: string; originalname: string } | undefined,
    @Body('folder') folder?: string,
    @Body('publicIdPrefix') publicIdPrefix?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Missing file. Use form field "file".');
    }
    return this.uploadImageUseCase.execute({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      options: {
        folder: folder || undefined,
        publicIdPrefix: publicIdPrefix || undefined,
      },
    });
  }
}
