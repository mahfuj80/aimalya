import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @ApiProperty({ example: 'owner@techplex.com' })
  @IsEmail()
  businessEmail!: string;

  @ApiProperty({ example: 'Tech Plex Cafe' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  businessName!: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  confirmPassword!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Equals(true, { message: 'You must accept the terms and privacy policy' })
  acceptTerms!: boolean;
}
