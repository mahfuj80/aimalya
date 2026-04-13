import { UserRole } from '../../../../core/enums/role.enum';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly roles: UserRole[],
    public readonly isActive: boolean,
  ) {}

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }
}
