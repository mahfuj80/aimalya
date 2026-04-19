import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { ResetForgottenPasswordUseCase } from './reset-forgotten-password.use-case';

describe('ResetForgottenPasswordUseCase', () => {
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

  it('resets password when OTP is valid and not expired', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        hasher.hash('oldPassword1'),
        [UserRole.USER],
        true,
        null,
        hasher.hash('123456'),
        new Date(Date.now() + 5 * 60 * 1000),
      ),
    );

    const useCase = new ResetForgottenPasswordUseCase(repo, hasher);
    const result = await useCase.execute({
      email: 'user@mail.com',
      otpCode: '123456',
      newPassword: 'newPassword1',
    });

    expect(result.success).toBe(true);
    expect(repo.updatePasswordHash).toHaveBeenCalledWith(
      'u1',
      expect.any(String),
    );
    expect(repo.updateRefreshTokenHash).toHaveBeenCalledWith('u1', null);
    expect(repo.clearPasswordResetCode).toHaveBeenCalledWith('u1');
  });

  it('throws for invalid OTP code', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        hasher.hash('oldPassword1'),
        [UserRole.USER],
        true,
        null,
        hasher.hash('123456'),
        new Date(Date.now() + 5 * 60 * 1000),
      ),
    );

    const useCase = new ResetForgottenPasswordUseCase(repo, hasher);

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        otpCode: '999999',
        newPassword: 'newPassword1',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
