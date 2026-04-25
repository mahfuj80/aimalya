import { createHash } from 'crypto';
import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { RequestForgotPasswordUseCase } from './request-forgot-password.use-case';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

describe('RequestForgotPasswordUseCase', () => {
  const createRepo = (): jest.Mocked<IAuthUserRepository> => ({
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
    updatePasswordHash: jest.fn(),
    setPasswordResetCode: jest.fn(),
    clearPasswordResetCode: jest.fn(),
  });

  it('stores OTP and sends reset email for active user', async () => {
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

    const sendPasswordResetEmailExecute = jest
      .fn<
        Promise<{ success: boolean }>,
        [
          {
            email: string;
            otpCode: string;
            expiryMinutes: number;
          },
        ]
      >()
      .mockResolvedValue({ success: true });

    const sendPasswordResetEmailUseCase: Pick<
      SendPasswordResetEmailUseCase,
      'execute'
    > = {
      execute: sendPasswordResetEmailExecute,
    };

    const useCase = new RequestForgotPasswordUseCase(
      repo,
      sendPasswordResetEmailUseCase as SendPasswordResetEmailUseCase,
    );

    const result = await useCase.execute({ email: 'user@mail.com' });

    expect(result.success).toBe(true);
    expect(repo.setPasswordResetCode.mock.calls).toHaveLength(1);
    const [savedUserId, savedCodeHash, savedExpiresAt] =
      repo.setPasswordResetCode.mock.calls[0];
    expect(savedUserId).toBe('u1');
    expect(savedCodeHash).toMatch(/^[a-f0-9]{64}$/);
    expect(savedExpiresAt).toBeInstanceOf(Date);
    expect(sendPasswordResetEmailExecute).toHaveBeenCalled();

    const emailCall = sendPasswordResetEmailExecute.mock.calls[0]?.[0] as {
      otpCode: string;
    };
    const hashedOtp = createHash('sha256')
      .update(emailCall.otpCode)
      .digest('hex');
    expect(hashedOtp).toBe(savedCodeHash);
  });

  it('returns success without email send when user is missing', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(null);

    const sendPasswordResetEmailExecute = jest
      .fn<
        Promise<{ success: boolean }>,
        [
          {
            email: string;
            otpCode: string;
            expiryMinutes: number;
          },
        ]
      >()
      .mockResolvedValue({ success: true });

    const sendPasswordResetEmailUseCase: Pick<
      SendPasswordResetEmailUseCase,
      'execute'
    > = {
      execute: sendPasswordResetEmailExecute,
    };

    const useCase = new RequestForgotPasswordUseCase(
      repo,
      sendPasswordResetEmailUseCase as SendPasswordResetEmailUseCase,
    );

    const result = await useCase.execute({ email: 'unknown@mail.com' });

    expect(result.success).toBe(true);
    expect(repo.setPasswordResetCode.mock.calls).toHaveLength(0);
  });
});
