import { UserResponseDto } from '../dto/user.response.dto';
import type { UserEntity } from '../../domain/entities/user.entity';

export class UserDtoMapper {
  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      roles: entity.roles,
      isActive: entity.isActive,
    };
  }
}
