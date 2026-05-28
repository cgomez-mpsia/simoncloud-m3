import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { FileModule } from './file/file.module';
import { MessageRelayService } from './relay/message-relay.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    FileModule,
  ],
  providers: [PrismaService, MessageRelayService],
})
export class AppModule {}
