import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  FILE_REPOSITORY_PORT,
  FileRepositoryPort,
  UploadedFile,
} from './ports/file-repository.port';
import { FILE_STORAGE_PORT, FileStoragePort } from './ports/file-storage.port';

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY_PORT) private readonly repo: FileRepositoryPort,
    @Inject(FILE_STORAGE_PORT) private readonly storage: FileStoragePort,
  ) {}

  async upload(
    filename: string,
    buffer: Buffer,
    mimeType: string,
    sizeBytes: number,
  ): Promise<UploadedFile & { publicUrl: string }> {
    const fileId = randomUUID();
    const storageKey = `uploads/${fileId}/${filename}`;

    // 1. Registro pendiente en PostgreSQL
    await this.repo.createPending({ id: fileId, filename, sizeBytes, mimeType, storageKey });

    // 2. Upload a MinIO + SHA-256 incremental (técnica POC-01 aplicada al adaptador)
    const sha256Hash = await this.storage.uploadAndHash(storageKey, buffer, mimeType);

    // 3. Transacción atómica: UPDATE files + INSERT outbox_events (Outbox Pattern)
    const file = await this.repo.completeWithHash(fileId, sha256Hash);

    return {
      ...file,
      publicUrl: this.storage.getPublicUrl(storageKey),
    };
  }
}
