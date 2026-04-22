import { NotificationChannel, VerificationPurpose } from '@prisma/client';
import { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';
import { SendVerificationCodeUseCase } from './send-verification-code.use-case';

describe('SendVerificationCodeUseCase', () => {
  const createRepo = (): jest.Mocked<IVerificationCodeRepository> => ({
    create: jest.fn().mockResolvedValue({} as never),
    findLatestPending: jest.fn(),
    updateStatus: jest.fn(),
    incrementAttempts: jest.fn(),
    markVerifiedAndConsumed: jest.fn(),
    cancelPendingForTarget: jest.fn(),
  });

  it('stores hashed code and returns expiry', async () => {
    const repo = createRepo();
    const useCase = new SendVerificationCodeUseCase(repo);

    const result = await useCase.execute({
      purpose: VerificationPurpose.FORGOT_PASSWORD,
      channel: NotificationChannel.EMAIL,
      email: 'user@example.com',
      ttlMinutes: 10,
      maxAttempts: 5,
    });

    expect(result.code).toHaveLength(6);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        purpose: VerificationPurpose.FORGOT_PASSWORD,
        channel: NotificationChannel.EMAIL,
        codeHash: expect.any(String),
      }),
    );
  });
});
