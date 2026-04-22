import { Inject, Injectable } from '@nestjs/common';
import type { AdminAuditLogEntity } from '../../domain/entities/admin-audit-log.entity';
import { ADMIN_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/admin-audit-log.repository';
import type { IAdminAuditLogRepository } from '../../domain/repositories/admin-audit-log.repository';

@Injectable()
export class ListAdminAuditLogsUseCase {
  constructor(
    @Inject(ADMIN_AUDIT_LOG_REPOSITORY)
    private readonly adminAuditLogRepository: IAdminAuditLogRepository,
  ) {}

  executeByActor(actorUserId: string): Promise<AdminAuditLogEntity[]> {
    return this.adminAuditLogRepository.findByActorUserId(actorUserId);
  }

  executeByBusiness(businessId: string): Promise<AdminAuditLogEntity[]> {
    return this.adminAuditLogRepository.findByBusinessId(businessId);
  }
}
