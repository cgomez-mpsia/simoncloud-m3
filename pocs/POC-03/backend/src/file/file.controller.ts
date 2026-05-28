import {
  Controller, Delete, Get, Param, Post,
  UploadedFile, UseGuards, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, JwtPayload } from '../auth/current-user.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('drops/:dropId/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  async upload(
    @Param('dropId') dropId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    if (!file) throw new BadRequestException('Campo "file" requerido');
    const result = await this.fileService.upload(
      file.originalname, file.buffer, file.mimetype, file.size, dropId, user.sub,
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

  @Get('files/:id')
  async getFile(@Param('id') id: string) {
    const result = await this.fileService.getFile(id);
    return { ...result, sizeBytes: result.sizeBytes.toString() };
  }

  @Delete('files/:id')
  async deleteFile(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.fileService.deleteFile(id, user.sub, user.role);
    return { message: 'Archivo eliminado' };
  }
}
