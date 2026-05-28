import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FILE_REPOSITORY_PORT } from './ports/file-repository.port';
import { FILE_STORAGE_PORT } from './ports/file-storage.port';
import { PgFileRepository } from './adapters/pg-file.repository';
import { S3FileStorage } from './adapters/s3-file.storage';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    PrismaService,
    { provide: FILE_REPOSITORY_PORT, useClass: PgFileRepository },
    { provide: FILE_STORAGE_PORT, useClass: S3FileStorage },
  ],
})
export class FileModule {}
