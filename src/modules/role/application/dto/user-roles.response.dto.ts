import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../core/enums/role.enum';

export class UserRolesResponseDto {
  @ApiProperty({ example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  userId!: string;

  @ApiProperty({ enum: UserRole, isArray: true, example: [UserRole.USER] })
  roles!: UserRole[];
}
