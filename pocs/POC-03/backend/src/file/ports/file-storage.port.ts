export const FILE_STORAGE_PORT = 'FILE_STORAGE_PORT';

export interface FileStoragePort {
  // Streams buffer to MinIO and computes SHA-256 incrementally (técnica POC-01)
  uploadAndHash(key: string, buffer: Buffer, contentType: string): Promise<string>;
  getPublicUrl(key: string): string;
}
