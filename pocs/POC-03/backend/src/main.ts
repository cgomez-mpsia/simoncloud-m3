import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`POC-03 backend corriendo en http://localhost:${port}`);
}

bootstrap();
