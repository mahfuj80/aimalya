import { VerificationPurpose } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class VerifyVerificationCodeRequestDto {
  @ApiProperty({ enum: VerificationPurpose })
  @IsEnum(VerificationPurpose)
  purpose!: VerificationPurpose;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+14155552671' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  phoneNumber?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  code!: string;
}
