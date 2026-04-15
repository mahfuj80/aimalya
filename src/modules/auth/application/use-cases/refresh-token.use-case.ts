import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly tokenService: TokenService,
    private readonly passwordHasherService: PasswordHasherService,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.authUserRepository.findById(decoded.userId);

    if (!user || !user.refreshTokenHash || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenMatches = this.passwordHasherService.verify(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const nextAccessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    const nextRefreshToken = await this.tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    const nextRefreshHash = this.passwordHasherService.hash(nextRefreshToken);
    await this.authUserRepository.updateRefreshTokenHash(
      user.id,
      nextRefreshHash,
    );

    return {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    };
  }
}
