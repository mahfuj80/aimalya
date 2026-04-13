import { UserRole } from '../../../../core/enums/role.enum';

export class RoleEntity {
  constructor(
    public readonly userId: string,
    public readonly roles: UserRole[],
  ) {}

  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(requiredRoles: UserRole[]): boolean {
    return requiredRoles.some((role) => this.roles.includes(role));
  }
}
