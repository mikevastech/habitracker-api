import { ApiTags, ApiCreatedResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
import { UploadImageBodyDto } from '../application/dtos/upload-image.dto';
import { UploadImageResponseDto } from '../application/dtos/upload-response.dto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@ApiTags('upload')
@Controller('upload')
@UseGuards(SessionGuard)
export class UploadController {
  constructor(private readonly uploadImageUseCase: UploadImageUseCase) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageBodyDto })
  @ApiCreatedResponse({ type: UploadImageResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadImage(
    @UploadedFile() file: { buffer: Buffer; mimetype: string; originalname: string } | undefined,
    @Body() body: UploadImageBodyDto,
  ) {
    if (!file) {
      throw new BadRequestException('Missing file. Use form field "file".');
    }
    return this.uploadImageUseCase.execute({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      options: {
        folder: body.folder ?? undefined,
        publicIdPrefix: body.publicIdPrefix ?? undefined,
      },
    });
  }
}
