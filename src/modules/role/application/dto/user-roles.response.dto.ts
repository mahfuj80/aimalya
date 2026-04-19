import { UserRole } from '../../../../core/enums/role.enum';

export class UserRolesResponseDto {
  userId!: string;
  roles!: UserRole[];
}
