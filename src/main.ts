import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma/prisma.service';
import { validateEnv } from './config/env.validation';
import { setupSwagger } from './docs/swagger';
import { json } from 'express';

type WebhookRequest = {
  path?: string;
  originalUrl?: string;
  rawBody?: Buffer;
};

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    json({
      verify: (req, _res, buf) => {
        const request = req as WebhookRequest;
        const requestPath = request.path ?? request.originalUrl;

        if (requestPath === '/api/v1/payments/webhook/stripe') {
          request.rawBody = buf;
        }
      },
    }),
  );

  setupSwagger(app);

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
