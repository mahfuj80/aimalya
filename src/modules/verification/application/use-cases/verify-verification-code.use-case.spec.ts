import { UnauthorizedException } from '@nestjs/common';
import {
  NotificationChannel,
  VerificationPurpose,
  VerificationStatus,
} from '@prisma/client';
import { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';
import { hashVerificationCode } from './send-verification-code.use-case';
import { VerifyVerificationCodeUseCase } from './verify-verification-code.use-case';

describe('VerifyVerificationCodeUseCase', () => {
  const createRepo = (): jest.Mocked<IVerificationCodeRepository> => ({
    create: jest.fn(),
    findLatestPending: jest.fn(),
    updateStatus: jest.fn(),
    incrementAttempts: jest.fn(),
    markVerifiedAndConsumed: jest.fn(),
    cancelPendingForTarget: jest.fn(),
  });

  it('verifies and consumes valid code', async () => {
    const repo = createRepo();
    repo.findLatestPending.mockResolvedValue({
      id: 'vc1',
      userId: 'u1',
      email: 'user@example.com',
      phoneNumber: null,
      purpose: VerificationPurpose.FORGOT_PASSWORD,
      channel: NotificationChannel.EMAIL,
      codeHash: hashVerificationCode('123456'),
      status: VerificationStatus.PENDING,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verifiedAt: null,
      consumedAt: null,
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const useCase = new VerifyVerificationCodeUseCase(repo);

    await expect(
      useCase.execute({
        purpose: VerificationPurpose.FORGOT_PASSWORD,
        email: 'user@example.com',
        code: '123456',
      }),
    ).resolves.toEqual({ success: true });

    expect(repo.markVerifiedAndConsumed.mock.calls).toEqual(
      expect.arrayContaining([['vc1']]),
    );
  });

  it('fails and increments attempts for invalid code', async () => {
    const repo = createRepo();
    repo.findLatestPending.mockResolvedValue({
      id: 'vc1',
      userId: 'u1',
      email: 'user@example.com',
      phoneNumber: null,
      purpose: VerificationPurpose.FORGOT_PASSWORD,
      channel: NotificationChannel.EMAIL,
      codeHash: hashVerificationCode('123456'),
      status: VerificationStatus.PENDING,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verifiedAt: null,
      consumedAt: null,
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.incrementAttempts.mockResolvedValue({ attempts: 1 } as never);

    const useCase = new VerifyVerificationCodeUseCase(repo);

    await expect(
      useCase.execute({
        purpose: VerificationPurpose.FORGOT_PASSWORD,
        email: 'user@example.com',
        code: '000000',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(repo.incrementAttempts.mock.calls).toEqual(
      expect.arrayContaining([['vc1']]),
    );
  });
});
