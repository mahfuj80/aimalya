import { Inject, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

@Injectable()
export class RequestForgotPasswordUseCase {
  private static readonly RESET_CODE_EXPIRY_MINUTES = 10;

  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
  ) {}

  async execute(input: { email: string }): Promise<{ success: boolean }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      return { success: true };
    }

    const otpCode = randomInt(0, 1000000).toString().padStart(6, '0');
    const codeHash = this.passwordHasherService.hash(otpCode);
    const expiresAt = new Date(
      Date.now() +
        RequestForgotPasswordUseCase.RESET_CODE_EXPIRY_MINUTES * 60 * 1000,
    );

    await this.authUserRepository.setPasswordResetCode(
      user.id,
      codeHash,
      expiresAt,
    );

    await this.sendPasswordResetEmailUseCase.execute({
      email: user.email,
      otpCode,
      expiryMinutes: RequestForgotPasswordUseCase.RESET_CODE_EXPIRY_MINUTES,
    });

    return { success: true };
  }
}
