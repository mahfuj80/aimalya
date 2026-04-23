import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { VerificationPurpose } from '@prisma/client';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { TokenService } from '../../infrastructure/services/token.service';
import { VerifyVerificationCodeUseCase } from '../../../verification/application/use-cases/verify-verification-code.use-case';

@Injectable()
export class VerifyForgotPasswordCodeUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly verifyVerificationCodeUseCase: VerifyVerificationCodeUseCase,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: {
    email: string;
    otpCode: string;
  }): Promise<{ success: boolean; resetToken: string }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    await this.verifyVerificationCodeUseCase.execute({
      purpose: VerificationPurpose.FORGOT_PASSWORD,
      email: input.email,
      code: input.otpCode,
    });

    const resetToken = await this.tokenService.generateForgotPasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    return {
      success: true,
      resetToken,
    };
  }
}
