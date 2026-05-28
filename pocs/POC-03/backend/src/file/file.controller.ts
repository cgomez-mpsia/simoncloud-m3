import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('api')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Campo "file" requerido');

    const result = await this.fileService.upload(
      file.originalname,
      file.buffer,
      file.mimetype,
      file.size,
    );

    return {
      id: result.id,
      filename: result.filename,
      sizeBytes: result.sizeBytes.toString(),
      mimeType: result.mimeType,
      sha256Hash: result.sha256Hash,
      status: result.status,
      publicUrl: result.publicUrl,
      uploadedAt: result.uploadedAt,
    };
  }
}
