import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DROP_REPOSITORY_PORT, DropRepositoryPort } from './ports/drop-repository.port';

@Injectable()
export class DropsService {
  constructor(
    @Inject(DROP_REPOSITORY_PORT) private readonly repo: DropRepositoryPort,
    private readonly config: ConfigService,
  ) {}

  async list(userId: string, role: string) {
    if (role === 'DOCENTE') return this.repo.findManyByDocente(userId);
    return this.repo.findAllOpen();
  }

  async create(name: string, description: string | undefined, docenteId: string) {
    return this.repo.create({ name, description, docenteId });
  }

  async getOne(id: string) {
    const drop = await this.repo.findById(id);
    if (!drop) throw new NotFoundException('SimonDrop no encontrado');
    return drop;
  }

  async close(id: string, docenteId: string) {
    const drop = await this.repo.findById(id);
    if (!drop) throw new NotFoundException();
    if (drop.docenteId !== docenteId) throw new ForbiddenException();
    return this.repo.close(id);
  }

  async remove(id: string, docenteId: string) {
    const drop = await this.repo.findById(id);
    if (!drop) throw new NotFoundException();
    if (drop.docenteId !== docenteId) throw new ForbiddenException();
    return this.repo.deleteWithFiles(id);
  }

  async listFiles(dropId: string, userId: string, role: string) {
    const uploaderId = role === 'DOCENTE' ? undefined : userId;
    const files = await this.repo.listFiles(dropId, uploaderId);
    const endpoint = this.config.get('MINIO_ENDPOINT', 'http://localhost:9000');
    const bucket = this.config.get('MINIO_BUCKET', 'poc03-uploads');
    return files.map(f => ({ ...f, publicUrl: `${endpoint}/${bucket}/${f.storageKey}` }));
  }
}
