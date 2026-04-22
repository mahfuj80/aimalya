import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../user/domain/repositories/user.repository';
import { PrismaUserRepository } from '../user/infrastructure/repositories/prisma-user.repository';
import { ListAdminAuditLogsUseCase } from './application/use-cases/list-admin-audit-logs.use-case';
import { WriteAdminAuditLogUseCase } from './application/use-cases/write-admin-audit-log.use-case';
import { ADMIN_AUDIT_LOG_REPOSITORY } from './domain/repositories/admin-audit-log.repository';
import { PrismaAdminAuditLogRepository } from './infrastructure/repositories/prisma-admin-audit-log.repository';
import { AdminAuditController } from './presentation/controllers/admin-audit.controller';

@Module({
  controllers: [AdminAuditController],
  providers: [
    WriteAdminAuditLogUseCase,
    ListAdminAuditLogsUseCase,
    {
      provide: ADMIN_AUDIT_LOG_REPOSITORY,
      useClass: PrismaAdminAuditLogRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [WriteAdminAuditLogUseCase],
})
export class AdminAuditModule {}
