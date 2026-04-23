import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BusinessMembershipRole } from '../../../../core/enums/business-membership-role.enum';

export class AddBusinessMemberRequestDto {
  @ApiProperty({ example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @IsString()
  @MinLength(1)
  userId!: string;

  @ApiProperty({
    enum: BusinessMembershipRole,
    example: BusinessMembershipRole.MANAGER,
  })
  @IsEnum(BusinessMembershipRole)
  role!: BusinessMembershipRole;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
