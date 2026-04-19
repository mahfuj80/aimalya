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
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $on: (event: string, callback: (arg: unknown) => Promise<void>) => void;
};

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly prisma: PrismaClientLike;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const client = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    }) as unknown as PrismaClientLike;
    this.prisma = client;
  }

  get user() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.prisma.user;
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
