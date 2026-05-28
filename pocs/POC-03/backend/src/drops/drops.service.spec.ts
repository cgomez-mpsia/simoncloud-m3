import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DropsService } from './drops.service';
import { DROP_REPOSITORY_PORT, DropRepositoryPort, SimonDropEntity } from './ports/drop-repository.port';

const MOCK_DROP: SimonDropEntity = {
  id: 'drop-uuid-001',
  name: 'Proyecto Final MAT101',
  description: null,
  status: 'OPEN',
  docenteId: 'docente-uuid-001',
  createdAt: new Date('2026-05-01T10:00:00Z'),
  closedAt: null,
};

describe('DropsService', () => {
  let service: DropsService;
  let repo: jest.Mocked<DropRepositoryPort>;

  beforeEach(async () => {
    repo = {
      findManyByDocente: jest.fn(),
      findAllOpen: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      close: jest.fn(),
      deleteWithFiles: jest.fn(),
      listFiles: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        DropsService,
        { provide: DROP_REPOSITORY_PORT, useValue: repo },
        { provide: ConfigService, useValue: { get: jest.fn((k: string, d: string) => d) } },
      ],
    }).compile();

    service = module.get(DropsService);
  });

  describe('list()', () => {
    it('docente ve solo sus drops', async () => {
      repo.findManyByDocente.mockResolvedValue([MOCK_DROP]);
      const result = await service.list('docente-uuid-001', 'DOCENTE');
      expect(repo.findManyByDocente).toHaveBeenCalledWith('docente-uuid-001');
      expect(result).toHaveLength(1);
    });

    it('estudiante ve drops abiertos', async () => {
      repo.findAllOpen.mockResolvedValue([MOCK_DROP]);
      const result = await service.list('student-001', 'ESTUDIANTE');
      expect(repo.findAllOpen).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('create()', () => {
    it('crea un drop con los datos correctos', async () => {
      repo.create.mockResolvedValue(MOCK_DROP);
      const result = await service.create('Proyecto Final MAT101', undefined, 'docente-uuid-001');
      expect(repo.create).toHaveBeenCalledWith({
        name: 'Proyecto Final MAT101',
        description: undefined,
        docenteId: 'docente-uuid-001',
      });
      expect(result.id).toBe('drop-uuid-001');
    });
  });

  describe('close()', () => {
    it('solo el docente dueño puede cerrar el drop', async () => {
      repo.findById.mockResolvedValue(MOCK_DROP);
      repo.close.mockResolvedValue({ ...MOCK_DROP, status: 'CLOSED', closedAt: new Date() });

      const result = await service.close('drop-uuid-001', 'docente-uuid-001');
      expect(result.status).toBe('CLOSED');
    });

    it('lanza ForbiddenException si otro docente intenta cerrar', async () => {
      repo.findById.mockResolvedValue(MOCK_DROP);
      await expect(service.close('drop-uuid-001', 'otro-docente')).rejects.toThrow(ForbiddenException);
    });

    it('lanza NotFoundException si el drop no existe', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.close('no-existe', 'docente-uuid-001')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('elimina el drop y sus archivos si el docente es el dueño', async () => {
      repo.findById.mockResolvedValue(MOCK_DROP);
      repo.deleteWithFiles.mockResolvedValue(MOCK_DROP);
      await expect(service.remove('drop-uuid-001', 'docente-uuid-001')).resolves.not.toThrow();
      expect(repo.deleteWithFiles).toHaveBeenCalledWith('drop-uuid-001');
    });

    it('lanza ForbiddenException si otro usuario intenta eliminar', async () => {
      repo.findById.mockResolvedValue(MOCK_DROP);
      await expect(service.remove('drop-uuid-001', 'impostor')).rejects.toThrow(ForbiddenException);
    });
  });
});
