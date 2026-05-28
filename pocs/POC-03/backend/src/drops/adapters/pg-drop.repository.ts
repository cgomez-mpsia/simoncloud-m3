import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DropRepositoryPort, FileEntity, SimonDropEntity } from '../ports/drop-repository.port';

@Injectable()
export class PgDropRepository implements DropRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByDocente(docenteId: string): Promise<SimonDropEntity[]> {
    return this.prisma.simonDrop.findMany({
      where: { docenteId },
      include: { _count: { select: { files: true } } },
      orderBy: { createdAt: 'desc' },
    }) as unknown as SimonDropEntity[];
  }

  async findAllOpen(): Promise<SimonDropEntity[]> {
    return this.prisma.simonDrop.findMany({
      where: { status: 'OPEN' },
      include: { docente: { select: { name: true } }, _count: { select: { files: true } } },
      orderBy: { createdAt: 'desc' },
    }) as unknown as SimonDropEntity[];
  }

  async create(data: { name: string; description?: string; docenteId: string }): Promise<SimonDropEntity> {
    return this.prisma.simonDrop.create({ data }) as unknown as SimonDropEntity;
  }

  async findById(id: string): Promise<SimonDropEntity | null> {
    return this.prisma.simonDrop.findUnique({
      where: { id },
      include: { docente: { select: { name: true, email: true } } },
    }) as unknown as SimonDropEntity | null;
  }

  async close(id: string): Promise<SimonDropEntity> {
    return this.prisma.simonDrop.update({
      where: { id },
      data: { status: 'CLOSED', closedAt: new Date() },
    }) as unknown as SimonDropEntity;
  }

  async deleteWithFiles(id: string): Promise<SimonDropEntity> {
    const drop = await this.prisma.simonDrop.findUniqueOrThrow({ where: { id } });
    await this.prisma.file.deleteMany({ where: { dropId: id } });
    await this.prisma.simonDrop.delete({ where: { id } });
    return drop as unknown as SimonDropEntity;
  }

  async listFiles(dropId: string, uploaderId?: string): Promise<FileEntity[]> {
    const where = uploaderId ? { dropId, uploaderId } : { dropId };
    return this.prisma.file.findMany({
      where,
      include: { uploader: { select: { name: true } } },
      orderBy: { uploadedAt: 'desc' },
    }) as unknown as FileEntity[];
  }
}
