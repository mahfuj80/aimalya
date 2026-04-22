import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { VerificationPurpose } from '@prisma/client';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { VerifyVerificationCodeUseCase } from '../../../verification/application/use-cases/verify-verification-code.use-case';

@Injectable()
export class ResetForgottenPasswordUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly verifyVerificationCodeUseCase: VerifyVerificationCodeUseCase,
  ) {}

  async execute(input: {
    email: string;
    otpCode: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    await this.verifyVerificationCodeUseCase.execute({
      purpose: VerificationPurpose.FORGOT_PASSWORD,
      email: input.email,
      code: input.otpCode,
    });

    const newPasswordHash = this.passwordHasherService.hash(input.newPassword);

    await this.authUserRepository.updatePasswordHash(user.id, newPasswordHash);
    await this.authUserRepository.updateRefreshTokenHash(user.id, null);

    return { success: true };
  }
}
