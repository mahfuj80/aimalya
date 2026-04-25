import { createHash } from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { TokenService } from '../../infrastructure/services/token.service';
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
        createHash('sha256').update('123456').digest('hex'),
        new Date(Date.now() + 5 * 60 * 1000),
      ),
    );

    const generateForgotPasswordResetToken = jest
      .fn<Promise<string>, [{ userId: string; email: string }]>()
      .mockResolvedValue('generated-reset-token');

    const tokenService: Pick<TokenService, 'generateForgotPasswordResetToken'> =
      {
        generateForgotPasswordResetToken,
      };

    const useCase = new VerifyForgotPasswordCodeUseCase(
      repo,
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
    expect(repo.clearPasswordResetCode.mock.calls).toEqual([['u1']]);
    expect(generateForgotPasswordResetToken).toHaveBeenCalledWith({
      userId: 'u1',
      email: 'user@mail.com',
    });
  });

  it('throws unauthorized for missing user', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(null);

    const tokenService: Pick<TokenService, 'generateForgotPasswordResetToken'> =
      {
        generateForgotPasswordResetToken: jest.fn(),
      };

    const useCase = new VerifyForgotPasswordCodeUseCase(
      repo,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({ email: 'none@mail.com', otpCode: '123456' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws unauthorized for invalid code', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        'hashed-password',
        [UserRole.USER],
        true,
        null,
        createHash('sha256').update('654321').digest('hex'),
        new Date(Date.now() + 5 * 60 * 1000),
      ),
    );

    const tokenService: Pick<TokenService, 'generateForgotPasswordResetToken'> =
      {
        generateForgotPasswordResetToken: jest.fn(),
      };

    const useCase = new VerifyForgotPasswordCodeUseCase(
      repo,
      tokenService as TokenService,
    );

    await expect(
      useCase.execute({ email: 'user@mail.com', otpCode: '123456' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
