import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class ResetForgottenPasswordUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: {
    email: string;
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean }> {
    if (input.newPassword !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    let payload: { userId: string; email: string };

    try {
      payload = await this.tokenService.verifyForgotPasswordResetToken(
        input.resetToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (payload.email.toLowerCase() !== input.email.toLowerCase()) {
      throw new UnauthorizedException('Reset token does not match email');
    }

    const user = await this.authUserRepository.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const newPasswordHash = this.passwordHasherService.hash(input.newPassword);

    await this.authUserRepository.updatePasswordHash(user.id, newPasswordHash);
    await this.authUserRepository.updateRefreshTokenHash(user.id, null);

    return { success: true };
  }
}
