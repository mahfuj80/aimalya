import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/database/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const prismaServiceMock: Partial<PrismaService> = {
    user: {} as PrismaService['user'],
    onModuleInit: () => undefined,
    onModuleDestroy: () => undefined,
    enableShutdownHooks: () => undefined,
  };

  beforeEach(async () => {
    process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
    process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN ??= '15m';
    process.env.JWT_REFRESH_EXPIRES_IN ??= '7d';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
