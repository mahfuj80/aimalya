import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async execute(input: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean }> {
    const user = await this.authUserRepository.findById(input.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not authorized');
    }

    const validCurrentPassword = this.passwordHasherService.verify(
      input.currentPassword,
      user.passwordHash,
    );

    if (!validCurrentPassword) {
      throw new UnauthorizedException('Current password is invalid');
    }

    const newPasswordHash = this.passwordHasherService.hash(input.newPassword);

    await this.authUserRepository.updatePasswordHash(user.id, newPasswordHash);
    await this.authUserRepository.updateRefreshTokenHash(user.id, null);
    await this.authUserRepository.clearPasswordResetCode(user.id);

    return { success: true };
  }
}
