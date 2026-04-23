import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '../../../../core/enums/role.enum';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository';
import { AUTH_USER_REPOSITORY } from '../../domain/repositories/auth-user.repository';
import { PasswordHasherService } from '../../infrastructure/services/password-hasher.service';
import { TokenService } from '../../infrastructure/services/token.service';
import {
  BUSINESS_REPOSITORY,
  type IBusinessRepository,
} from '../../../business/domain/repositories/business.repository';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AUTH_USER_REPOSITORY)
    private readonly authUserRepository: IAuthUserRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly tokenService: TokenService,
  ) {}

  private normalizeSlug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async execute(input: {
    fullName: string;
    businessEmail: string;
    businessName: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    if (input.password !== input.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!input.acceptTerms) {
      throw new BadRequestException(
        'You must accept the terms and privacy policy',
      );
    }

    const existing = await this.authUserRepository.findByEmail(
      input.businessEmail,
    );

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = this.passwordHasherService.hash(input.password);
    const user = await this.authUserRepository.create({
      fullName: input.fullName,
      email: input.businessEmail,
      passwordHash,
      roles: [UserRole.USER],
    });

    const baseSlug = this.normalizeSlug(input.businessName);
    let finalSlug = baseSlug;
    let sequence = 2;

    while (await this.businessRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${sequence}`;
      sequence += 1;
    }

    await this.businessRepository.create({
      ownerUserId: user.id,
      name: input.businessName,
      slug: finalSlug,
    });

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
