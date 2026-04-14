import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';
import { setupSwagger } from './docs/swagger';

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
