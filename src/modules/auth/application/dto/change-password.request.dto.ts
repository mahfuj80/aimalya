import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'CurrentPass123!' })
  @IsString()
  @MinLength(8)
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecurePass123!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
