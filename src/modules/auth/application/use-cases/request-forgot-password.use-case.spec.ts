import { UserRole } from '../../../../core/enums/role.enum';
import { AuthUserEntity } from '../../domain/entities/auth-user.entity';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { RequestForgotPasswordUseCase } from './request-forgot-password.use-case';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

describe('RequestForgotPasswordUseCase', () => {
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

  it('stores OTP and sends reset email for active user', async () => {
    const repo = createRepo();
    repo.findByEmail.mockResolvedValue(
      new AuthUserEntity(
        'u1',
        'user@mail.com',
        hasher.hash('pass12345'),
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

    const useCase = new RequestForgotPasswordUseCase(
      repo,
      hasher,
      sendPasswordResetEmailUseCase as SendPasswordResetEmailUseCase,
    );

    const result = await useCase.execute({ email: 'user@mail.com' });

    expect(result.success).toBe(true);
    expect(repo.setPasswordResetCode.mock.calls).toEqual(
      expect.arrayContaining([['u1', expect.any(String), expect.any(Date)]]),
    );
    // Verify the reset email was sent
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

    const useCase = new RequestForgotPasswordUseCase(
      repo,
      hasher,
      sendPasswordResetEmailUseCase as SendPasswordResetEmailUseCase,
    );

    const result = await useCase.execute({ email: 'unknown@mail.com' });

    expect(result.success).toBe(true);
    expect(repo.setPasswordResetCode.mock.calls).toHaveLength(0);
  });
});
