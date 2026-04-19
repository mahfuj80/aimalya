import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { RoleEntity } from '../../domain/entities/role.entity';
import { IRoleRepository } from '../../domain/repositories/role.repository';
import { GetUserRolesUseCase } from './get-user-roles.use-case';

describe('GetUserRolesUseCase', () => {
  it('returns roles for an existing user', async () => {
    const repo: IRoleRepository = {
      getByUserId: jest
        .fn()
        .mockResolvedValue(new RoleEntity('u1', [UserRole.ADMIN])),
      updateRoles: jest.fn(),
    };

    const useCase = new GetUserRolesUseCase(repo);
    const result = await useCase.execute('u1');

    expect(result.roles).toEqual([UserRole.ADMIN]);
  });

  it('throws when user does not exist', async () => {
    const repo: IRoleRepository = {
      getByUserId: jest.fn().mockResolvedValue(null),
      updateRoles: jest.fn(),
    };

    const useCase = new GetUserRolesUseCase(repo);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
