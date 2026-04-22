import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  if (process.env.SWAGGER_ENABLED === 'false') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Aimalya API')
    .setDescription('Aimalya Enterprise API documentation.\n\nThis API provides endpoints for authentication, user management, business operations, notifications, payments, and more.\n\n**All endpoints require proper authentication and authorization.**')
    .setVersion('1.1.0')
    .setContact('Aimalya Support', 'https://aimalya.com', 'support@aimalya.com')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
