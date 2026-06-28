export const DROP_REPOSITORY_PORT = 'DROP_REPOSITORY_PORT';

export interface SimonDropEntity {
  id: string;
  name: string;
  description: string | null;
  status: string;
  docenteId: string;
  createdAt: Date;
  closedAt: Date | null;
  docente?: { name: string; email?: string };
  _count?: { files: number };
  files?: FileEntity[];
}

export interface FileEntity {
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
  uploader?: { name: string };
}

export interface DropRepositoryPort {
  findManyByDocente(docenteId: string): Promise<SimonDropEntity[]>;
  findAllOpen(): Promise<SimonDropEntity[]>;
  create(data: { name: string; description?: string; docenteId: string }): Promise<SimonDropEntity>;
  findById(id: string): Promise<SimonDropEntity | null>;
  close(id: string): Promise<SimonDropEntity>;
  deleteWithFiles(id: string): Promise<SimonDropEntity>;
  listFiles(dropId: string, uploaderId?: string): Promise<FileEntity[]>;
}
