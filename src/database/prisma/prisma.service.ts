import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

type PrismaClientLike = {
  user: PrismaClient['user'];
  business: PrismaClient['business'];
  businessMember: PrismaClient['businessMember'];
  verificationCode: PrismaClient['verificationCode'];
  adminAuditLog: PrismaClient['adminAuditLog'];
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $on: (event: string, callback: (arg: unknown) => Promise<void>) => void;
};

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly prisma: PrismaClientLike;

  private normalizeConnectionString(connectionString: string): string {
    try {
      const parsed = new URL(connectionString);
      const shouldUseLocalhost =
        process.platform === 'win32' && parsed.hostname === 'db';

      if (shouldUseLocalhost) {
        parsed.hostname = 'localhost';
        this.logger.warn(
          'DATABASE_URL host "db" detected on Windows host; using "localhost" for Prisma connection.',
        );
        return parsed.toString();
      }

      return connectionString;
    } catch {
      return connectionString;
    }
  }

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const resolvedConnectionString =
      this.normalizeConnectionString(connectionString);

    const client = new PrismaClient({
      adapter: new PrismaPg({ connectionString: resolvedConnectionString }),
    }) as unknown as PrismaClientLike;
    this.prisma = client;
  }

  get user() {
    return this.prisma.user;
  }

  get business() {
    return this.prisma.business;
  }

  get businessMember() {
    return this.prisma.businessMember;
  }

  get verificationCode() {
    return this.prisma.verificationCode;
  }

  get adminAuditLog() {
    return this.prisma.adminAuditLog;
  }

  async onModuleInit(): Promise<void> {
    await this.prisma.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
  }

  enableShutdownHooks(app: INestApplication): void {
    const shutdown = async (signal: string) => {
      this.logger.log(`Received ${signal}, closing Nest application...`);
      await app.close();
    };

    process.once('SIGINT', () => {
      void shutdown('SIGINT');
    });

    process.once('SIGTERM', () => {
      void shutdown('SIGTERM');
    });
  }
}
