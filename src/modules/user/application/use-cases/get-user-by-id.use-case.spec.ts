import { NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';

describe('GetUserByIdUseCase', () => {
  it('returns a user when found', async () => {
    const repo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'u1@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new GetUserByIdUseCase(repo);
    const result = await useCase.execute('u1');

    expect(result.id).toBe('u1');
  });

  it('throws when user does not exist', async () => {
    const repo: IUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new GetUserByIdUseCase(repo);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
