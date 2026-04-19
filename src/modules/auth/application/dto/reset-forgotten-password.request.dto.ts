import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ResetForgottenPasswordRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  otpCode!: string;

  @ApiProperty({ example: 'BrandNewPass123!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
