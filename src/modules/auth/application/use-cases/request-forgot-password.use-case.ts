import { Inject, Injectable } from '@nestjs/common';
import { NotificationChannel, VerificationPurpose } from '@prisma/client';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { SendVerificationCodeUseCase } from '../../../verification/application/use-cases/send-verification-code.use-case';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

@Injectable()
export class RequestForgotPasswordUseCase {
  private static readonly RESET_CODE_EXPIRY_MINUTES = 10;

  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
  ) {}

  async execute(input: { email: string }): Promise<{ success: boolean }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      return { success: true };
    }

    const { code, expiresAt } = await this.sendVerificationCodeUseCase.execute({
      userId: user.id,
      email: user.email,
      purpose: VerificationPurpose.FORGOT_PASSWORD,
      channel: NotificationChannel.EMAIL,
      ttlMinutes: RequestForgotPasswordUseCase.RESET_CODE_EXPIRY_MINUTES,
    });

    const expiryMinutes = Math.max(
      1,
      Math.ceil((expiresAt.getTime() - Date.now()) / (60 * 1000)),
    );

    await this.sendPasswordResetEmailUseCase.execute({
      email: user.email,
      otpCode: code,
      expiryMinutes,
    });

    return { success: true };
  }
}
