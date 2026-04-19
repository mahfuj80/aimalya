import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';

describe('UpdateUserProfileUseCase', () => {
  it('updates profile email for existing user', async () => {
    const repo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'old@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'new@mail.com', [UserRole.USER], true),
        ),
    };

    const useCase = new UpdateUserProfileUseCase(repo);
    const result = await useCase.execute('u1', 'new@mail.com');

    expect(result.email).toBe('new@mail.com');
  });

  it('throws not found for missing user', async () => {
    const repo: IUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      updateProfile: jest.fn(),
    };

    const useCase = new UpdateUserProfileUseCase(repo);

    await expect(
      useCase.execute('missing', 'new@mail.com'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws conflict when email already exists', async () => {
    const repo: IUserRepository = {
      findById: jest
        .fn()
        .mockResolvedValue(
          new UserEntity('u1', 'old@mail.com', [UserRole.USER], true),
        ),
      findAll: jest.fn(),
      updateProfile: jest
        .fn()
        .mockRejectedValue(new Error('Unique constraint failed')),
    };

    const useCase = new UpdateUserProfileUseCase(repo);

    await expect(
      useCase.execute('u1', 'exists@mail.com'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
