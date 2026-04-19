import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const appServiceMock: Pick<AppService, 'getHealthStatus'> = {
      getHealthStatus: jest.fn().mockResolvedValue({
        status: 'ok',
        service: 'aimalya-api',
        timestamp: '2026-01-01T00:00:00.000Z',
        database: 'up',
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API health status', async () => {
      await expect(appController.getHealth()).resolves.toEqual({
        status: 'ok',
        service: 'aimalya-api',
        timestamp: '2026-01-01T00:00:00.000Z',
        database: 'up',
      });
    });
  });
});
