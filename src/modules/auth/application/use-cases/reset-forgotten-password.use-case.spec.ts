import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { ResetForgottenPasswordUseCase } from './reset-forgotten-password.use-case';
import { TokenService } from '../../infrastructure/services/token.service';

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

  it('resets password when reset token is valid', async () => {
    const repo = createRepo();
    repo.findById.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        hasher.hash('oldPassword1'),
        [UserRole.USER],
        true,
        null,
        null,
        null,
      ),
    );

    const tokenService: Pick<TokenService, 'verifyForgotPasswordResetToken'> = {
      verifyForgotPasswordResetToken: jest.fn().mockResolvedValue({
        userId: 'u1',
        email: 'user@mail.com',
      }),
    };

    const useCase = new ResetForgottenPasswordUseCase(
      repo,
      hasher,
      tokenService as TokenService,
    );

    const result = await useCase.execute({
      email: 'user@mail.com',
      resetToken: 'reset-token',
      newPassword: 'newPassword1',
      confirmPassword: 'newPassword1',
    });

    expect(result.success).toBe(true);
    expect(repo.updatePasswordHash.mock.calls).toEqual(
      expect.arrayContaining([['u1', expect.any(String)]]),
    );
    expect(repo.updateRefreshTokenHash.mock.calls).toEqual(
      expect.arrayContaining([['u1', null]]),
    );
    expect(tokenService.verifyForgotPasswordResetToken).toHaveBeenCalledWith(
      'reset-token',
    );
  });

  it('throws when passwords do not match', async () => {
    const repo = createRepo();
    const tokenService: Pick<TokenService, 'verifyForgotPasswordResetToken'> = {
      verifyForgotPasswordResetToken: jest.fn(),
    };

    const useCase = new ResetForgottenPasswordUseCase(
      repo,
      hasher,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        resetToken: 'reset-token',
        newPassword: 'newPassword1',
        confirmPassword: 'differentPassword1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws for invalid reset token', async () => {
    const repo = createRepo();
    const tokenService: Pick<TokenService, 'verifyForgotPasswordResetToken'> = {
      verifyForgotPasswordResetToken: jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Invalid or expired reset token')),
    };

    const useCase = new ResetForgottenPasswordUseCase(
      repo,
      hasher,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        resetToken: 'invalid-reset-token',
        newPassword: 'newPassword1',
        confirmPassword: 'newPassword1',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws when token email does not match request email', async () => {
    const repo = createRepo();
    const tokenService: Pick<TokenService, 'verifyForgotPasswordResetToken'> = {
      verifyForgotPasswordResetToken: jest.fn().mockResolvedValue({
        userId: 'u1',
        email: 'other@mail.com',
      }),
    };

    const useCase = new ResetForgottenPasswordUseCase(
      repo,
      hasher,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        resetToken: 'reset-token',
        newPassword: 'newPassword1',
        confirmPassword: 'newPassword1',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
