import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { VerificationPurpose, VerificationStatus } from '@prisma/client';
import { verifyVerificationCodeHash } from './send-verification-code.use-case';
import { VERIFICATION_CODE_REPOSITORY } from '../../domain/repositories/verification-code.repository';
import type { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';

type VerifyVerificationCodeInput = {
  purpose: VerificationPurpose;
  email?: string;
  phoneNumber?: string;
  code: string;
};

@Injectable()
export class VerifyVerificationCodeUseCase {
  constructor(
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(
    input: VerifyVerificationCodeInput,
  ): Promise<{ success: boolean }> {
    if (!input.email && !input.phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }

    const code = await this.verificationCodeRepository.findLatestPending({
      email: input.email,
      phoneNumber: input.phoneNumber,
      purpose: input.purpose,
    });

    if (!code || code.expiresAt < new Date()) {
      if (code && code.status === VerificationStatus.PENDING) {
        await this.verificationCodeRepository.updateStatus(
          code.id,
          VerificationStatus.EXPIRED,
        );
      }

      throw new UnauthorizedException('Invalid or expired verification code');
    }

    if (code.attempts >= code.maxAttempts) {
      await this.verificationCodeRepository.updateStatus(
        code.id,
        VerificationStatus.CANCELED,
      );
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    const isValid = verifyVerificationCodeHash(input.code, code.codeHash);

    if (!isValid) {
      const updated = await this.verificationCodeRepository.incrementAttempts(
        code.id,
      );

      if (updated.attempts >= updated.maxAttempts) {
        await this.verificationCodeRepository.updateStatus(
          code.id,
          VerificationStatus.CANCELED,
        );
      }

      throw new UnauthorizedException('Invalid or expired verification code');
    }

    await this.verificationCodeRepository.markVerifiedAndConsumed(code.id);

    return { success: true };
  }
}
