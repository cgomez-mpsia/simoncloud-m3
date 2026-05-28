import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PgDropRepository } from './adapters/pg-drop.repository';
import { DROP_REPOSITORY_PORT } from './ports/drop-repository.port';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [DropsController],
  providers: [
    DropsService,
    PrismaService,
    { provide: DROP_REPOSITORY_PORT, useClass: PgDropRepository },
  ],
})
export class DropsModule {}
