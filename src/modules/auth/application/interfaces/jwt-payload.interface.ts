import { UserRole } from '../../../../core/enums/role.enum';

export type JwtPayload = {
  sub: string;
  email: string;
  roles: UserRole[];
};
