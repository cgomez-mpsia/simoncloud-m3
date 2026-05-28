export const FILE_REPOSITORY_PORT = 'FILE_REPOSITORY_PORT';

export interface PendingFile {
  id: string;
  filename: string;
  filePath?: string;
  sizeBytes: number;
  mimeType: string;
  storageKey: string;
  dropId: string;
  uploaderId: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  filePath: string | null;
  sizeBytes: bigint;
  mimeType: string;
  storageKey: string;
  sha256Hash: string | null;
  status: string;
  dropId: string;
  uploaderId: string;
  uploadedAt: Date;
}

export interface FileRepositoryPort {
  createPending(file: PendingFile): Promise<void>;
  completeWithHash(fileId: string, sha256Hash: string): Promise<UploadedFile>;
  findById(fileId: string): Promise<UploadedFile | null>;
  delete(fileId: string): Promise<UploadedFile>;
}
