import type { AdminAuditLogEntity } from '../entities/admin-audit-log.entity';

export const ADMIN_AUDIT_LOG_REPOSITORY = Symbol('ADMIN_AUDIT_LOG_REPOSITORY');

export interface IAdminAuditLogRepository {
  create(input: {
    actorUserId: string;
    businessId?: string;
    action: string;
    targetType?: string;
    targetId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: unknown;
  }): Promise<AdminAuditLogEntity>;
  findByActorUserId(actorUserId: string): Promise<AdminAuditLogEntity[]>;
  findByBusinessId(businessId: string): Promise<AdminAuditLogEntity[]>;
}
