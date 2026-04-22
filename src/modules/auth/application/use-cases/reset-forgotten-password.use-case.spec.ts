import { UnauthorizedException } from '@nestjs/common';
import { VerificationPurpose } from '@prisma/client';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { ResetForgottenPasswordUseCase } from './reset-forgotten-password.use-case';
import { VerifyVerificationCodeUseCase } from '../../../verification/application/use-cases/verify-verification-code.use-case';

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
        null,
        null,
      ),
    );

    const verifyVerificationCodeUseCase: Pick<
      VerifyVerificationCodeUseCase,
      'execute'
    > = {
      execute: jest.fn().mockResolvedValue({ success: true }),
    };

    const useCase = new ResetForgottenPasswordUseCase(
      repo,
      hasher,
      verifyVerificationCodeUseCase as VerifyVerificationCodeUseCase,
    );
    const result = await useCase.execute({
      email: 'user@mail.com',
      otpCode: '123456',
      newPassword: 'newPassword1',
    });

    expect(result.success).toBe(true);
    expect(repo.updatePasswordHash.mock.calls).toEqual(
      expect.arrayContaining([['u1', expect.any(String)]]),
    );
    expect(repo.updateRefreshTokenHash.mock.calls).toEqual(
      expect.arrayContaining([['u1', null]]),
    );
    expect(verifyVerificationCodeUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose: VerificationPurpose.FORGOT_PASSWORD,
        email: 'user@mail.com',
        code: '123456',
      }),
    );
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
        null,
        null,
      ),
    );

    const verifyVerificationCodeUseCase: Pick<
      VerifyVerificationCodeUseCase,
      'execute'
    > = {
      execute: jest
        .fn()
        .mockRejectedValue(new UnauthorizedException('Invalid or expired reset code')),
    };

    const useCase = new ResetForgottenPasswordUseCase(
      repo,
      hasher,
      verifyVerificationCodeUseCase as VerifyVerificationCodeUseCase,
    );

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        otpCode: '999999',
        newPassword: 'newPassword1',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
