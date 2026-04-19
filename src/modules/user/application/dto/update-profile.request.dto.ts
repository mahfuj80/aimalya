import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiProperty({ example: 'updated.user@example.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;
}
