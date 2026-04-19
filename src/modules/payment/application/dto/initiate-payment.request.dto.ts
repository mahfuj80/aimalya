import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class InitiatePaymentRequestDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 2999, description: 'Amount in cents' })
  @IsInt()
  @Min(1)
  amount!: number;

  @ApiProperty({ example: 'Premium subscription' })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ example: 'premium' })
  @IsOptional()
  @IsString()
  planType?: string;
}
