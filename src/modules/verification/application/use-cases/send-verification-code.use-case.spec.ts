import { NotificationChannel, VerificationPurpose } from '@prisma/client';
import { VerificationCodeEntity } from '../../domain/entities/verification-code.entity';
import { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';
import { SendVerificationCodeUseCase } from './send-verification-code.use-case';

describe('SendVerificationCodeUseCase', () => {
  const createRepo = (): jest.Mocked<IVerificationCodeRepository> => ({
    create: jest
      .fn()
      .mockResolvedValue(
        new VerificationCodeEntity(
          'vc1',
          'u1',
          'user@example.com',
          null,
          VerificationPurpose.FORGOT_PASSWORD,
          NotificationChannel.EMAIL,
          'hashed-code',
          'PENDING' as const,
          new Date(Date.now() + 10 * 60 * 1000),
          null,
          null,
          0,
          5,
          new Date(),
          new Date(),
        ),
      ),
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
    const [createInput] = repo.create.mock.calls[0] ?? [];
    expect(createInput).toBeDefined();
    expect(createInput.email).toBe('user@example.com');
    expect(createInput.purpose).toBe(VerificationPurpose.FORGOT_PASSWORD);
    expect(createInput.channel).toBe(NotificationChannel.EMAIL);
    expect(typeof createInput.codeHash).toBe('string');
  });
});
