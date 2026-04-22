import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminAuditLogRequestDto {
  @ApiProperty({ example: 'AUTH_ADMIN_ONLY_CHECK' })
  @IsString()
  @MinLength(3)
  action!: string;

  @ApiPropertyOptional({ example: 'd32f30f8-0051-4c6f-9f85-d94acaa3fd50' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  businessId?: string;

  @ApiPropertyOptional({ example: 'USER' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  targetType?: string;

  @ApiPropertyOptional({ example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  targetId?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
