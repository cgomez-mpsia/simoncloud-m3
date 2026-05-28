import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DropsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async list(userId: string, role: string) {
    if (role === 'DOCENTE') {
      return this.prisma.simonDrop.findMany({
        where: { docenteId: userId },
        include: { _count: { select: { files: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.simonDrop.findMany({
      where: { status: 'OPEN' },
      include: {
        docente: { select: { name: true } },
        _count: { select: { files: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(name: string, description: string | undefined, docenteId: string) {
    return this.prisma.simonDrop.create({
      data: { name, description, docenteId },
    });
  }

  async getOne(id: string) {
    const drop = await this.prisma.simonDrop.findUnique({
      where: { id },
      include: { docente: { select: { name: true, email: true } } },
    });
    if (!drop) throw new NotFoundException('SimonDrop no encontrado');
    return drop;
  }

  async close(id: string, docenteId: string) {
    const drop = await this.prisma.simonDrop.findUnique({ where: { id } });
    if (!drop) throw new NotFoundException();
    if (drop.docenteId !== docenteId) throw new ForbiddenException();
    return this.prisma.simonDrop.update({
      where: { id },
      data: { status: 'CLOSED', closedAt: new Date() },
    });
  }

  async remove(id: string, docenteId: string) {
    const drop = await this.prisma.simonDrop.findUnique({ where: { id } });
    if (!drop) throw new NotFoundException();
    if (drop.docenteId !== docenteId) throw new ForbiddenException();
    await this.prisma.file.deleteMany({ where: { dropId: id } });
    return this.prisma.simonDrop.delete({ where: { id } });
  }

  async listFiles(dropId: string, userId: string, role: string) {
    const where = role === 'DOCENTE' ? { dropId } : { dropId, uploaderId: userId };
    const files = await this.prisma.file.findMany({
      where,
      include: { uploader: { select: { name: true } } },
      orderBy: { uploadedAt: 'desc' },
    });
    const endpoint = this.config.get('MINIO_ENDPOINT', 'http://localhost:9000');
    const bucket = this.config.get('MINIO_BUCKET', 'poc03-uploads');
    return files.map(f => ({ ...f, publicUrl: `${endpoint}/${bucket}/${f.storageKey}` }));
  }
}
