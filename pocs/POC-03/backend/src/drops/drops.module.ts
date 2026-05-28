import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [DropsController],
  providers: [DropsService, PrismaService],
})
export class DropsModule {}
