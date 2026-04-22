import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminAuditLogResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  actorUserId!: string;

  @ApiPropertyOptional()
  businessId!: string | null;

  @ApiProperty()
  action!: string;

  @ApiPropertyOptional()
  targetType!: string | null;

  @ApiPropertyOptional()
  targetId!: string | null;

  @ApiPropertyOptional()
  ipAddress!: string | null;

  @ApiPropertyOptional()
  userAgent!: string | null;

  @ApiPropertyOptional({ type: Object })
  metadata!: unknown;

  @ApiProperty()
  createdAt!: Date;
}
