import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { AdminAuditLogEntity } from '../../domain/entities/admin-audit-log.entity';
import { IAdminAuditLogRepository } from '../../domain/repositories/admin-audit-log.repository';
import { WriteAdminAuditLogUseCase } from './write-admin-audit-log.use-case';

describe('WriteAdminAuditLogUseCase', () => {
  it('creates audit log when actor user exists', async () => {
    const auditRepo: IAdminAuditLogRepository = {
      create: jest
        .fn()
        .mockResolvedValue(
          new AdminAuditLogEntity(
            'a1',
            'u1',
            null,
            'AUTH_ADMIN_ONLY_CHECK',
            null,
            null,
            '127.0.0.1',
            'jest',
            null,
            new Date('2026-01-01'),
          ),
        ),
      findByActorUserId: jest.fn(),
      findByBusinessId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'admin@mail.com', [UserRole.ADMIN], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new WriteAdminAuditLogUseCase(auditRepo, userRepo);

    const result = await useCase.execute({
      actorUserId: 'u1',
      action: 'AUTH_ADMIN_ONLY_CHECK',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    });

    expect(result.action).toBe('AUTH_ADMIN_ONLY_CHECK');
  });

  it('throws when actor user does not exist', async () => {
    const auditRepo: IAdminAuditLogRepository = {
      create: jest.fn(),
      findByActorUserId: jest.fn(),
      findByBusinessId: jest.fn(),
    };

    const userRepo: IUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new WriteAdminAuditLogUseCase(auditRepo, userRepo);

    await expect(
      useCase.execute({
        actorUserId: 'missing',
        action: 'AUTH_ADMIN_ONLY_CHECK',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
