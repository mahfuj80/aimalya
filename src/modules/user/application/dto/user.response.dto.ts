import { UserRole } from '../../../../core/enums/role.enum';

export class UserResponseDto {
  id!: string;
  email!: string;
  roles!: UserRole[];
  isActive!: boolean;
}
