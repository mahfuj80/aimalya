import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma/prisma.service';

type HealthStatus = {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  database: 'up' | 'down';
};

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHealthStatus(): Promise<HealthStatus> {
    try {
      await this.prismaService.user.count();

      return {
        status: 'ok',
        service: 'aimalya-api',
        timestamp: new Date().toISOString(),
        database: 'up',
      };
    } catch {
      return {
        status: 'degraded',
        service: 'aimalya-api',
        timestamp: new Date().toISOString(),
        database: 'down',
      };
    }
  }
}
