export const FILE_STORAGE_PORT = 'FILE_STORAGE_PORT';

export interface FileStoragePort {
  uploadAndHash(key: string, buffer: Buffer, contentType: string): Promise<string>;
  getPublicUrl(key: string): string;
  deleteObject(key: string): Promise<void>;
}
