import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// BigInt no es serializable nativamente a JSON — Prisma lo usa para sizeBytes
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`POC-03 backend corriendo en http://localhost:${port}`);
}

bootstrap();
