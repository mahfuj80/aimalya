import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import type { AdminAuditLogEntity } from '../../domain/entities/admin-audit-log.entity';
import { ADMIN_AUDIT_LOG_REPOSITORY } from '../../domain/repositories/admin-audit-log.repository';
import type { IAdminAuditLogRepository } from '../../domain/repositories/admin-audit-log.repository';

type WriteAdminAuditLogInput = {
  actorUserId: string;
  businessId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: unknown;
};

@Injectable()
export class WriteAdminAuditLogUseCase {
  constructor(
    @Inject(ADMIN_AUDIT_LOG_REPOSITORY)
    private readonly adminAuditLogRepository: IAdminAuditLogRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: WriteAdminAuditLogInput): Promise<AdminAuditLogEntity> {
    const actor = await this.userRepository.findById(input.actorUserId);

    if (!actor) {
      throw new NotFoundException('Actor user not found');
    }

    return this.adminAuditLogRepository.create(input);
  }
}
