import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { DropsModule } from './drops/drops.module';
import { FileModule } from './file/file.module';
import { MessageRelayService } from './relay/message-relay.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    DropsModule,
    FileModule,
  ],
  providers: [PrismaService, MessageRelayService],
})
export class AppModule {}
