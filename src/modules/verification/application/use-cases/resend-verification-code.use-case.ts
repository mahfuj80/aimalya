import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationChannel, VerificationPurpose } from '@prisma/client';
import { SendVerificationCodeUseCase } from './send-verification-code.use-case';
import { VERIFICATION_CODE_REPOSITORY } from '../../domain/repositories/verification-code.repository';
import type { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';
import { Inject } from '@nestjs/common';

type ResendVerificationCodeInput = {
  purpose: VerificationPurpose;
  channel: NotificationChannel;
  email?: string;
  phoneNumber?: string;
  userId?: string;
  ttlMinutes?: number;
  maxAttempts?: number;
};

@Injectable()
export class ResendVerificationCodeUseCase {
  constructor(
    private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(input: ResendVerificationCodeInput): Promise<{ code: string; expiresAt: Date }> {
    if (!input.email && !input.phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }

    await this.verificationCodeRepository.cancelPendingForTarget({
      email: input.email,
      phoneNumber: input.phoneNumber,
      purpose: input.purpose,
    });

    return this.sendVerificationCodeUseCase.execute(input);
  }
}
