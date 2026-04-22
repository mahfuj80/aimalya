import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotificationChannel, VerificationPurpose } from '@prisma/client';
import { randomInt, createHash, timingSafeEqual } from 'crypto';
import { VERIFICATION_CODE_REPOSITORY } from '../../domain/repositories/verification-code.repository';
import type { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';

type SendVerificationCodeInput = {
  purpose: VerificationPurpose;
  channel: NotificationChannel;
  email?: string;
  phoneNumber?: string;
  userId?: string;
  ttlMinutes?: number;
  maxAttempts?: number;
};

type SendVerificationCodeResult = {
  code: string;
  expiresAt: Date;
};

export const hashVerificationCode = (rawCode: string): string =>
  createHash('sha256').update(rawCode).digest('hex');

export const verifyVerificationCodeHash = (
  rawCode: string,
  storedHash: string,
): boolean => {
  const incomingHash = hashVerificationCode(rawCode);

  const incomingBuffer = Buffer.from(incomingHash, 'utf8');
  const storedBuffer = Buffer.from(storedHash, 'utf8');

  if (incomingBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingBuffer, storedBuffer);
};

@Injectable()
export class SendVerificationCodeUseCase {
  private static readonly DEFAULT_TTL_MINUTES = 10;
  private static readonly DEFAULT_MAX_ATTEMPTS = 5;

  constructor(
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(
    input: SendVerificationCodeInput,
  ): Promise<SendVerificationCodeResult> {
    if (!input.email && !input.phoneNumber) {
      throw new BadRequestException('Email or phone number is required');
    }

    const ttlMinutes = input.ttlMinutes ?? SendVerificationCodeUseCase.DEFAULT_TTL_MINUTES;
    const maxAttempts = input.maxAttempts ?? SendVerificationCodeUseCase.DEFAULT_MAX_ATTEMPTS;

    const code = randomInt(0, 1000000).toString().padStart(6, '0');
    const codeHash = hashVerificationCode(code);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await this.verificationCodeRepository.create({
      userId: input.userId,
      email: input.email,
      phoneNumber: input.phoneNumber,
      purpose: input.purpose,
      channel: input.channel,
      codeHash,
      expiresAt,
      maxAttempts,
    });

    return { code, expiresAt };
  }
}
