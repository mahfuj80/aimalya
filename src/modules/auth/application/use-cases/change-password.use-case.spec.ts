import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { ChangePasswordUseCase } from './change-password.use-case';

describe('ChangePasswordUseCase', () => {
  const hasher = new PasswordHasherService();

  const createRepo = (): jest.Mocked<IAuthUserRepository> => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
    updatePasswordHash: jest.fn(),
    setPasswordResetCode: jest.fn(),
    clearPasswordResetCode: jest.fn(),
  });

  it('changes password for authenticated user with valid current password', async () => {
    const repo = createRepo();
    repo.findById.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        hasher.hash('currentPass123'),
        [UserRole.USER],
        true,
        null,
        null,
        null,
      ),
    );

    const useCase = new ChangePasswordUseCase(repo, hasher);
    const result = await useCase.execute({
      userId: 'u1',
      currentPassword: 'currentPass123',
      newPassword: 'newPass1234',
    });

    expect(result.success).toBe(true);
    expect(repo.updatePasswordHash).toHaveBeenCalledWith(
      'u1',
      expect.any(String),
    );
    expect(repo.updateRefreshTokenHash).toHaveBeenCalledWith('u1', null);
    expect(repo.clearPasswordResetCode).toHaveBeenCalledWith('u1');
  });

  it('throws when current password is invalid', async () => {
    const repo = createRepo();
    repo.findById.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        hasher.hash('currentPass123'),
        [UserRole.USER],
        true,
        null,
        null,
        null,
      ),
    );

    const useCase = new ChangePasswordUseCase(repo, hasher);

    await expect(
      useCase.execute({
        userId: 'u1',
        currentPassword: 'wrong-password',
        newPassword: 'newPass1234',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
