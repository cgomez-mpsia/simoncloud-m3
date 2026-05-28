import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FileService } from './file.service';
import {
  FILE_REPOSITORY_PORT,
  FileRepositoryPort,
  UploadedFile,
} from './ports/file-repository.port';
import { FILE_STORAGE_PORT, FileStoragePort } from './ports/file-storage.port';

const MOCK_FILE: UploadedFile = {
  id: 'file-uuid-001',
  filename: 'tesis.pdf',
  filePath: null,
  sizeBytes: BigInt(52428800),
  mimeType: 'application/pdf',
  storageKey: 'drops/drop-1/user-1/file-uuid-001/tesis.pdf',
  sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  status: 'COMPLETED',
  dropId: 'drop-uuid-001',
  uploaderId: 'user-uuid-001',
  uploadedAt: new Date('2026-05-28T10:00:00Z'),
};

describe('FileService', () => {
  let service: FileService;
  let repo: jest.Mocked<FileRepositoryPort>;
  let storage: jest.Mocked<FileStoragePort>;

  beforeEach(async () => {
    repo = {
      createPending: jest.fn(),
      completeWithHash: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    storage = {
      uploadAndHash: jest.fn(),
      getPublicUrl: jest.fn(),
      deleteObject: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        FileService,
        { provide: FILE_REPOSITORY_PORT, useValue: repo },
        { provide: FILE_STORAGE_PORT, useValue: storage },
      ],
    }).compile();

    service = module.get(FileService);
  });

  describe('upload()', () => {
    it('genera storageKey con dropId y uploaderId', async () => {
      const sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      repo.createPending.mockResolvedValue(undefined);
      repo.completeWithHash.mockResolvedValue(MOCK_FILE);
      storage.uploadAndHash.mockResolvedValue(sha256);
      storage.getPublicUrl.mockReturnValue('http://localhost:9000/bucket/key');

      const result = await service.upload('tesis.pdf', Buffer.from(''), 'application/pdf', 100, 'drop-1', 'user-1');

      expect(storage.uploadAndHash).toHaveBeenCalledWith(
        expect.stringContaining('drops/drop-1/user-1/'),
        expect.any(Buffer),
        'application/pdf',
      );
      expect(result.publicUrl).toBeDefined();
    });

    it('sha256 retornado es string de 64 chars hex', async () => {
      const sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      repo.createPending.mockResolvedValue(undefined);
      repo.completeWithHash.mockResolvedValue({ ...MOCK_FILE, sha256Hash: sha256 });
      storage.uploadAndHash.mockResolvedValue(sha256);
      storage.getPublicUrl.mockReturnValue('http://localhost:9000/key');

      const result = await service.upload('f.pdf', Buffer.from(''), 'application/pdf', 1, 'drop', 'user');

      expect(result.sha256Hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('preserva filePath cuando viene de folder upload', async () => {
      const sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      repo.createPending.mockResolvedValue(undefined);
      repo.completeWithHash.mockResolvedValue(MOCK_FILE);
      storage.uploadAndHash.mockResolvedValue(sha256);
      storage.getPublicUrl.mockReturnValue('http://localhost:9000/key');

      await service.upload('archivo.pdf', Buffer.from(''), 'application/pdf', 1, 'drop', 'user', 'carpeta/subcarpeta/archivo.pdf');

      expect(storage.uploadAndHash).toHaveBeenCalledWith(
        expect.stringContaining('carpeta/subcarpeta/archivo.pdf'),
        expect.any(Buffer),
        'application/pdf',
      );
    });
  });

  describe('getFile()', () => {
    it('retorna archivo con publicUrl', async () => {
      repo.findById.mockResolvedValue(MOCK_FILE);
      storage.getPublicUrl.mockReturnValue('http://localhost:9000/bucket/key');

      const result = await service.getFile('file-uuid-001');

      expect(result.id).toBe('file-uuid-001');
      expect(result.publicUrl).toBe('http://localhost:9000/bucket/key');
    });

    it('lanza NotFoundException si el archivo no existe', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(service.getFile('no-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteFile()', () => {
    it('docente puede eliminar cualquier archivo del drop', async () => {
      repo.findById.mockResolvedValue(MOCK_FILE);
      storage.deleteObject.mockResolvedValue(undefined);
      repo.delete.mockResolvedValue(MOCK_FILE);

      await expect(
        service.deleteFile('file-uuid-001', 'otro-user', 'DOCENTE'),
      ).resolves.not.toThrow();

      expect(storage.deleteObject).toHaveBeenCalledWith(MOCK_FILE.storageKey);
    });

    it('estudiante solo puede eliminar sus propios archivos', async () => {
      repo.findById.mockResolvedValue(MOCK_FILE); // uploaderId = 'user-uuid-001'
      storage.deleteObject.mockResolvedValue(undefined);
      repo.delete.mockResolvedValue(MOCK_FILE);

      // Mismo uploader → OK
      await expect(
        service.deleteFile('file-uuid-001', 'user-uuid-001', 'ESTUDIANTE'),
      ).resolves.not.toThrow();
    });

    it('lanza ForbiddenException si estudiante intenta eliminar archivo ajeno', async () => {
      repo.findById.mockResolvedValue(MOCK_FILE); // uploaderId = 'user-uuid-001'

      await expect(
        service.deleteFile('file-uuid-001', 'otro-user-uuid', 'ESTUDIANTE'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('lanza NotFoundException si el archivo no existe', async () => {
      repo.findById.mockResolvedValue(null);

      await expect(
        service.deleteFile('no-existe', 'user', 'DOCENTE'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
