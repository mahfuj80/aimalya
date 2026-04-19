import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ResetForgottenPasswordRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otpCode!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
