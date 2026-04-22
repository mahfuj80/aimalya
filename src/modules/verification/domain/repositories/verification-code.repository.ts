import {
  NotificationChannel,
  VerificationPurpose,
  VerificationStatus,
} from '@prisma/client';
import type { VerificationCodeEntity } from '../entities/verification-code.entity';

export const VERIFICATION_CODE_REPOSITORY = Symbol(
  'VERIFICATION_CODE_REPOSITORY',
);

export interface IVerificationCodeRepository {
  create(input: {
    userId?: string;
    email?: string;
    phoneNumber?: string;
    purpose: VerificationPurpose;
    channel: NotificationChannel;
    codeHash: string;
    expiresAt: Date;
    maxAttempts: number;
  }): Promise<VerificationCodeEntity>;
  findLatestPending(input: {
    email?: string;
    phoneNumber?: string;
    purpose: VerificationPurpose;
  }): Promise<VerificationCodeEntity | null>;
  updateStatus(id: string, status: VerificationStatus): Promise<void>;
  incrementAttempts(id: string): Promise<VerificationCodeEntity>;
  markVerifiedAndConsumed(id: string): Promise<void>;
  cancelPendingForTarget(input: {
    email?: string;
    phoneNumber?: string;
    purpose: VerificationPurpose;
  }): Promise<void>;
}
