import { Injectable } from '@nestjs/common';
import type { AdminAuditLog } from '@prisma/client';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { AdminAuditLogEntity } from '../../domain/entities/admin-audit-log.entity';
import { IAdminAuditLogRepository } from '../../domain/repositories/admin-audit-log.repository';

@Injectable()
export class PrismaAdminAuditLogRepository implements IAdminAuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(model: AdminAuditLog): AdminAuditLogEntity {
    return new AdminAuditLogEntity(
      model.id,
      model.actorUserId,
      model.businessId,
      model.action,
      model.targetType,
      model.targetId,
      model.ipAddress,
      model.userAgent,
      model.metadata,
      model.createdAt,
    );
  }

  async create(input: {
    actorUserId: string;
    businessId?: string;
    action: string;
    targetType?: string;
    targetId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: unknown;
  }): Promise<AdminAuditLogEntity> {
    const created = await this.prisma.adminAuditLog.create({
      data: {
        actorUserId: input.actorUserId,
        businessId: input.businessId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: input.metadata as object | undefined,
      },
    });

    return this.toEntity(created);
  }

  async findByActorUserId(actorUserId: string): Promise<AdminAuditLogEntity[]> {
    const models = await this.prisma.adminAuditLog.findMany({
      where: { actorUserId },
      orderBy: { createdAt: 'desc' },
    });

    return models.map((model) => this.toEntity(model));
  }

  async findByBusinessId(businessId: string): Promise<AdminAuditLogEntity[]> {
    const models = await this.prisma.adminAuditLog.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    return models.map((model) => this.toEntity(model));
  }
}
