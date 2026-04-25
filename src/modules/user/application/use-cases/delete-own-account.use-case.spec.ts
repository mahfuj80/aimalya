import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { DeleteOwnAccountUseCase } from './delete-own-account.use-case';

describe('DeleteOwnAccountUseCase', () => {
  it('deactivates existing user account', async () => {
    const deactivateById = jest.fn().mockResolvedValue(true);

    const repo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'u1@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
      deactivateById,
    };

    const useCase = new DeleteOwnAccountUseCase(repo);
    const result = await useCase.execute('u1');

    expect(result.success).toBe(true);
    expect(deactivateById).toHaveBeenCalledWith('u1');
  });

  it('throws when user does not exist', async () => {
    const repo: IUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
      deactivateById: jest.fn(),
    };

    const useCase = new DeleteOwnAccountUseCase(repo);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
