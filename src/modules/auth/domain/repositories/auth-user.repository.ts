import type { AuthUserEntity } from '../entities/auth-user.entity';

export const AUTH_USER_REPOSITORY = Symbol('AUTH_USER_REPOSITORY');

export interface IAuthUserRepository {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
  findById(id: string): Promise<AuthUserEntity | null>;
  create(input: {
    fullName?: string;
    email: string;
    passwordHash: string;
    roles: string[];
  }): Promise<AuthUserEntity>;
  updateRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<void>;
  updatePasswordHash(userId: string, passwordHash: string): Promise<void>;
  setPasswordResetCode(
    userId: string,
    codeHash: string,
    expiresAt: Date,
  ): Promise<void>;
  clearPasswordResetCode(userId: string): Promise<void>;
}
