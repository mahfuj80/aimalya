import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';

@Injectable()
export class ResetForgottenPasswordUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async execute(input: {
    email: string;
    otpCode: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (
      !user ||
      !user.isActive ||
      !user.passwordResetCodeHash ||
      !user.passwordResetCodeExpiresAt ||
      user.passwordResetCodeExpiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    const validCode = this.passwordHasherService.verify(
      input.otpCode,
      user.passwordResetCodeHash,
    );

    if (!validCode) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    const newPasswordHash = this.passwordHasherService.hash(input.newPassword);

    await this.authUserRepository.updatePasswordHash(user.id, newPasswordHash);
    await this.authUserRepository.updateRefreshTokenHash(user.id, null);
    await this.authUserRepository.clearPasswordResetCode(user.id);

    return { success: true };
  }
}
