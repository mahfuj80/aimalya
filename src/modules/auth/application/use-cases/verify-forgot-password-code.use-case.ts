import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class VerifyForgotPasswordCodeUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  private verifyCodeHash(rawCode: string, storedHash: string): boolean {
    const incomingHash = createHash('sha256').update(rawCode).digest('hex');
    const incomingBuffer = Buffer.from(incomingHash, 'utf8');
    const storedBuffer = Buffer.from(storedHash, 'utf8');

    if (incomingBuffer.length !== storedBuffer.length) {
      return false;
    }

    return timingSafeEqual(incomingBuffer, storedBuffer);
  }

  async execute(input: {
    email: string;
    otpCode: string;
  }): Promise<{ success: boolean; resetToken: string }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (
      !user ||
      !user.isActive ||
      !user.passwordResetCodeHash ||
      !user.passwordResetCodeExpiresAt ||
      user.passwordResetCodeExpiresAt < new Date() ||
      !this.verifyCodeHash(input.otpCode, user.passwordResetCodeHash)
    ) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    await this.authUserRepository.clearPasswordResetCode(user.id);

    const resetToken = await this.tokenService.generateForgotPasswordResetToken(
      {
        userId: user.id,
        email: user.email,
      },
    );

    return {
      success: true,
      resetToken,
    };
  }
}
