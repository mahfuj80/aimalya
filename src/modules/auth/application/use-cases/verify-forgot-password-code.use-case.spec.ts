import { UnauthorizedException } from '@nestjs/common';
import { VerificationPurpose } from '@prisma/client';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { TokenService } from '../../infrastructure/services/token.service';
import { VerifyVerificationCodeUseCase } from '../../../verification/application/use-cases/verify-verification-code.use-case';
import { VerifyForgotPasswordCodeUseCase } from './verify-forgot-password-code.use-case';

describe('VerifyForgotPasswordCodeUseCase', () => {
  const createRepo = (): jest.Mocked<IAuthUserRepository> => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
    updatePasswordHash: jest.fn(),
    setPasswordResetCode: jest.fn(),
    clearPasswordResetCode: jest.fn(),
  });

  it('verifies code and issues reset token', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        'hashed-password',
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

    const tokenService: Pick<TokenService, 'generateForgotPasswordResetToken'> = {
      generateForgotPasswordResetToken: jest
        .fn()
        .mockResolvedValue('generated-reset-token'),
    };

    const useCase = new VerifyForgotPasswordCodeUseCase(
      repo,
      verifyVerificationCodeUseCase as VerifyVerificationCodeUseCase,
      tokenService as TokenService,
    );

    const result = await useCase.execute({
      email: 'user@mail.com',
      otpCode: '123456',
    });

    expect(result).toEqual({
      success: true,
      resetToken: 'generated-reset-token',
    });
    expect(verifyVerificationCodeUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        purpose: VerificationPurpose.FORGOT_PASSWORD,
        email: 'user@mail.com',
        code: '123456',
      }),
    );
    expect(tokenService.generateForgotPasswordResetToken).toHaveBeenCalledWith({
      userId: 'u1',
      email: 'user@mail.com',
    });
  });

  it('throws unauthorized for missing user', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(null);

    const verifyVerificationCodeUseCase: Pick<
      VerifyVerificationCodeUseCase,
      'execute'
    > = {
      execute: jest.fn(),
    };

    const tokenService: Pick<TokenService, 'generateForgotPasswordResetToken'> = {
      generateForgotPasswordResetToken: jest.fn(),
    };

    const useCase = new VerifyForgotPasswordCodeUseCase(
      repo,
      verifyVerificationCodeUseCase as VerifyVerificationCodeUseCase,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({ email: 'none@mail.com', otpCode: '123456' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
