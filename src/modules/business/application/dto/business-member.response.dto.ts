import { ApiProperty } from '@nestjs/swagger';
import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';

export class BusinessMemberResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  businessId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: BusinessMembershipRole })
  role!: BusinessMembershipRole;

  @ApiProperty()
  isPrimary!: boolean;

  @ApiProperty()
  joinedAt!: Date;
}
