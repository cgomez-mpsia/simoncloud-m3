import { Module } from '@nestjs/common';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DropsController],
  providers: [DropsService, PrismaService],
})
export class DropsModule {}
