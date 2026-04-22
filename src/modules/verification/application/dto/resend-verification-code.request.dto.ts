import {
  NotificationChannel,
  VerificationPurpose,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class ResendVerificationCodeRequestDto {
  @ApiProperty({ enum: VerificationPurpose })
  @IsEnum(VerificationPurpose)
  purpose!: VerificationPurpose;

  @ApiProperty({ enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel!: NotificationChannel;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+14155552671' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '3b1f8c22-930f-4b6d-8ac4-d54c5988e6d3' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  userId?: string;
}
