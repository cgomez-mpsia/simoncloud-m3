import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FILE_REPOSITORY_PORT, FileRepositoryPort, UploadedFile } from './ports/file-repository.port';
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
    dropId: string,
    uploaderId: string,
    filePath?: string,
  ): Promise<UploadedFile & { publicUrl: string }> {
    const fileId = randomUUID();
    // Si viene de un folder upload, preservar la ruta relativa en el storageKey
    const storagePath = filePath ?? filename;
    const storageKey = `drops/${dropId}/${uploaderId}/${fileId}/${storagePath}`;

    await this.repo.createPending({ id: fileId, filename, filePath, sizeBytes, mimeType, storageKey, dropId, uploaderId });
    const sha256Hash = await this.storage.uploadAndHash(storageKey, buffer, mimeType);
    const file = await this.repo.completeWithHash(fileId, sha256Hash);

    return { ...file, publicUrl: this.storage.getPublicUrl(storageKey) };
  }

  async getFile(fileId: string): Promise<UploadedFile & { publicUrl: string }> {
    const file = await this.repo.findById(fileId);
    if (!file) throw new NotFoundException('Archivo no encontrado');
    return { ...file, publicUrl: this.storage.getPublicUrl(file.storageKey) };
  }

  async deleteFile(fileId: string, userId: string, role: string): Promise<void> {
    const file = await this.repo.findById(fileId);
    if (!file) throw new NotFoundException();
    if (role !== 'DOCENTE' && file.uploaderId !== userId) throw new ForbiddenException();
    await this.storage.deleteObject(file.storageKey);
    await this.repo.delete(fileId);
  }
}
