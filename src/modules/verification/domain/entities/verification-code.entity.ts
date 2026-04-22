import {
  NotificationChannel,
  VerificationPurpose,
  VerificationStatus,
} from '@prisma/client';

export class VerificationCodeEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly email: string | null,
    public readonly phoneNumber: string | null,
    public readonly purpose: VerificationPurpose,
    public readonly channel: NotificationChannel,
    public readonly codeHash: string,
    public readonly status: VerificationStatus,
    public readonly expiresAt: Date,
    public readonly verifiedAt: Date | null,
    public readonly consumedAt: Date | null,
    public readonly attempts: number,
    public readonly maxAttempts: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
