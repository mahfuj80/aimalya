import { UserRole } from '../../../../core/enums/role.enum';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { ListUsersUseCase } from './list-users.use-case';

describe('ListUsersUseCase', () => {
  it('returns all users', async () => {
    const repo: IUserRepository = {
      findById: jest.fn(),
      findAll: jest
        .fn()
        .mockResolvedValue([
          new UserEntity('u1', 'u1@mail.com', [UserRole.USER], true),
          new UserEntity('u2', 'u2@mail.com', [UserRole.ADMIN], true),
        ]),
      updateProfile: jest.fn(),
      deactivateById: jest.fn(),
    };

    const useCase = new ListUsersUseCase(repo);
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
  });

  it('returns empty list when no users exist', async () => {
    const repo: IUserRepository = {
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      updateProfile: jest.fn(),
      deactivateById: jest.fn(),
    };

    const useCase = new ListUsersUseCase(repo);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
