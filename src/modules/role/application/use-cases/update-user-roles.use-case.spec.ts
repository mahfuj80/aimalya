import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { RoleEntity } from '../../domain/entities/role.entity';
import { IRoleRepository } from '../../domain/repositories/role.repository';
import { UpdateUserRolesUseCase } from './update-user-roles.use-case';

describe('UpdateUserRolesUseCase', () => {
  it('updates roles for an existing user', async () => {
    const repo: IRoleRepository = {
      getByUserId: jest
        .fn()
        .mockResolvedValue(new RoleEntity('u1', [UserRole.USER])),
      updateRoles: jest
        .fn()
        .mockResolvedValue(new RoleEntity('u1', [UserRole.ADMIN])),
    };

    const useCase = new UpdateUserRolesUseCase(repo);
    const result = await useCase.execute('u1', [UserRole.ADMIN]);

    expect(result.roles).toEqual([UserRole.ADMIN]);
  });

  it('throws when user does not exist', async () => {
    const repo: IRoleRepository = {
      getByUserId: jest.fn().mockResolvedValue(null),
      updateRoles: jest.fn(),
    };

    const useCase = new UpdateUserRolesUseCase(repo);

    await expect(
      useCase.execute('missing', [UserRole.USER]),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
