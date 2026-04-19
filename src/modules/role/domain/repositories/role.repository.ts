import { UserRole } from '../../../../core/enums/role.enum';
import type { RoleEntity } from '../entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  getByUserId(userId: string): Promise<RoleEntity | null>;
  updateRoles(userId: string, roles: UserRole[]): Promise<RoleEntity>;
}
