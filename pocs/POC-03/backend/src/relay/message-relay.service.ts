import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';
import { PrismaService } from '../prisma/prisma.service';

// Topic exchange per CLAUDE.md §2 — nunca cola directa
const EXCHANGE = 'simoncloud.simondrop.events';

@Injectable()
export class MessageRelayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessageRelayService.name);
  private connection: amqplib.ChannelModel | null = null;
  private channel: amqplib.Channel | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const url = this.config.get<string>('RABBITMQ_URL', 'amqp://simon:simon123@localhost:5672');
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(EXCHANGE, 'topic', { durable: true });
      this.logger.log(`Relay conectado a RabbitMQ → exchange "${EXCHANGE}"`);
    } catch (err) {
      this.logger.error('No se pudo conectar a RabbitMQ', err);
    }
  }

  // Polling cada 2 segundos — patrón Polling Publisher del Outbox
  @Interval(2000)
  async relayPendingEvents() {
    if (!this.channel) return;

    const events = await this.prisma.outboxEvent.findMany({
      where: { published: false },
      take: 10,
      orderBy: { createdAt: 'asc' },
    });

    for (const event of events) {
      // routingKey: ArchivoSubidoIntegrationEvent → archivo.subido
      const routingKey = event.eventType
        .replace(/IntegrationEvent$/, '')
        .replace(/([A-Z])/g, (m, c, i) => (i > 0 ? '.' : '') + c.toLowerCase());

      this.channel.publish(
        EXCHANGE,
        routingKey,
        Buffer.from(JSON.stringify(event.payload)),
        { persistent: true, contentType: 'application/json' },
      );

      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: { published: true, publishedAt: new Date() },
      });

      this.logger.log(`Publicado ${event.eventType} [${event.id}] → ${EXCHANGE} [${routingKey}]`);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
