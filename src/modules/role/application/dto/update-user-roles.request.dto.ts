import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../../core/enums/role.enum';

export class UpdateUserRolesRequestDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsEnum(UserRole, { each: true })
  roles!: UserRole[];
}
