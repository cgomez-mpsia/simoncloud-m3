import { SHA256Hash } from '../domain/sha256-hash.vo';

export const FILE_STORAGE_PORT = 'FILE_STORAGE_PORT';

export interface FileStoragePort {
  uploadAndHash(key: string, buffer: Buffer, contentType: string): Promise<SHA256Hash>;
  getPublicUrl(key: string): string;
  deleteObject(key: string): Promise<void>;
}
