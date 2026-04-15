import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authUserRepository.findByEmail(input.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = this.passwordHasherService.verify(
      input.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    const refreshToken = await this.tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    const refreshTokenHash = this.passwordHasherService.hash(refreshToken);
    await this.authUserRepository.updateRefreshTokenHash(
      user.id,
      refreshTokenHash,
    );

    return { accessToken, refreshToken };
  }
}
