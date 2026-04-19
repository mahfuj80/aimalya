import { UserRolesResponseDto } from '../dto/user-roles.response.dto';
import type { RoleEntity } from '../../domain/entities/role.entity';

export class RoleDtoMapper {
  static toResponse(entity: RoleEntity): UserRolesResponseDto {
    return {
      userId: entity.userId,
      roles: entity.roles,
    };
  }
}
