import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../../core/enums/role.enum';

export class UpdateUserRolesRequestDto {
  @ApiProperty({
    enum: UserRole,
    isArray: true,
    example: [UserRole.ADMIN, UserRole.MANAGER],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsEnum(UserRole, { each: true })
  roles!: UserRole[];
}
