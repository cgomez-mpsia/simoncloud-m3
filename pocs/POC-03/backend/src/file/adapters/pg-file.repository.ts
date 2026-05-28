import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  FileRepositoryPort,
  PendingFile,
  UploadedFile,
} from '../ports/file-repository.port';

@Injectable()
export class PgFileRepository implements FileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async createPending(file: PendingFile): Promise<void> {
    await this.prisma.file.create({
      data: {
        id: file.id,
        filename: file.filename,
        sizeBytes: file.sizeBytes,
        mimeType: file.mimeType,
        storageKey: file.storageKey,
        status: 'UPLOADING',
      },
    });
  }

  async completeWithHash(fileId: string, sha256Hash: string): Promise<UploadedFile> {
    return this.prisma.$transaction(async (tx) => {
      const file = await tx.file.update({
        where: { id: fileId },
        data: { sha256Hash, status: 'COMPLETED' },
      });

      await tx.outboxEvent.create({
        data: {
          eventType: 'FileUploadedEvent',
          payload: {
            fileId: file.id,
            filename: file.filename,
            sha256Hash,
            storageKey: file.storageKey,
            uploadedAt: file.uploadedAt.toISOString(),
          },
        },
      });

      return file as unknown as UploadedFile;
    });
  }
}
