export const FILE_REPOSITORY_PORT = 'FILE_REPOSITORY_PORT';

export interface PendingFile {
  id: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  storageKey: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  sizeBytes: bigint;
  mimeType: string;
  storageKey: string;
  sha256Hash: string;
  status: string;
  uploadedAt: Date;
}

export interface FileRepositoryPort {
  createPending(file: PendingFile): Promise<void>;
  // Atomic: UPDATE files SET sha256+status + INSERT outbox_events in one $transaction
  completeWithHash(fileId: string, sha256Hash: string): Promise<UploadedFile>;
}
