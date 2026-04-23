import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetForgottenPasswordRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.password-reset-token.signature',
  })
  @IsString()
  resetToken!: string;

  @ApiProperty({ example: 'BrandNewPass123!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;

  @ApiProperty({ example: 'BrandNewPass123!' })
  @IsString()
  @MinLength(8)
  confirmPassword!: string;
}
