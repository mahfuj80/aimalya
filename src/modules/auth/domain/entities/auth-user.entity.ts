import { UserRole } from '../../../../core/enums/role.enum';

export class AuthUserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly roles: UserRole[],
    public readonly isActive: boolean,
    public readonly refreshTokenHash: string | null,
    public readonly passwordResetCodeHash: string | null,
    public readonly passwordResetCodeExpiresAt: Date | null,
  ) {}
}
