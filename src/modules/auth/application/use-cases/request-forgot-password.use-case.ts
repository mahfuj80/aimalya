import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomInt } from 'crypto';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

@Injectable()
export class RequestForgotPasswordUseCase {
  private static readonly RESET_CODE_EXPIRY_MINUTES = 10;

  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
  ) {}

  private static hashCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  async execute(input: { email: string }): Promise<{ success: boolean }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      return { success: true };
    }

    const code = randomInt(0, 1000000).toString().padStart(6, '0');
    const codeHash = RequestForgotPasswordUseCase.hashCode(code);
    const expiresAt = new Date(
      Date.now() +
        RequestForgotPasswordUseCase.RESET_CODE_EXPIRY_MINUTES * 60 * 1000,
    );

    await this.authUserRepository.setPasswordResetCode(
      user.id,
      codeHash,
      expiresAt,
    );

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
