import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { RequestForgotPasswordUseCase } from './request-forgot-password.use-case';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';
import { SendVerificationCodeUseCase } from '../../../verification/application/use-cases/send-verification-code.use-case';

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

    const sendPasswordResetEmailUseCase: Pick<
      SendPasswordResetEmailUseCase,
      'execute'
    > = {
      execute: jest.fn().mockResolvedValue({ success: true }),
    };

    const sendVerificationCodeUseCase: Pick<SendVerificationCodeUseCase, 'execute'> = {
      execute: jest.fn().mockResolvedValue({
        code: '123456',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      }),
    };

    const useCase = new RequestForgotPasswordUseCase(
      repo,
      sendVerificationCodeUseCase as SendVerificationCodeUseCase,
      sendPasswordResetEmailUseCase as SendPasswordResetEmailUseCase,
    );

    const result = await useCase.execute({ email: 'user@mail.com' });

    expect(result.success).toBe(true);
    expect(sendVerificationCodeUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'u1',
        email: 'user@mail.com',
      }),
    );
    expect(sendPasswordResetEmailUseCase.execute).toHaveBeenCalled();
  });

  it('returns success without email send when user is missing', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(null);

    const sendPasswordResetEmailUseCase: Pick<
      SendPasswordResetEmailUseCase,
      'execute'
    > = {
      execute: jest.fn().mockResolvedValue({ success: true }),
    };

    const sendVerificationCodeUseCase: Pick<SendVerificationCodeUseCase, 'execute'> = {
      execute: jest.fn(),
    };

    const useCase = new RequestForgotPasswordUseCase(
      repo,
      sendVerificationCodeUseCase as SendVerificationCodeUseCase,
      sendPasswordResetEmailUseCase as SendPasswordResetEmailUseCase,
    );

    const result = await useCase.execute({ email: 'unknown@mail.com' });

    expect(result.success).toBe(true);
    expect(sendVerificationCodeUseCase.execute).not.toHaveBeenCalled();
  });
});
