import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateBusinessRequestDto {
  @ApiPropertyOptional({ example: 'Tech Plex Cafe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: 'tech-plex-cafe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  slug?: string;

  @ApiPropertyOptional({ example: 'Restaurant' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  industry?: string;

  @ApiPropertyOptional({ example: 'Specialty coffee and brunch' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'UTC' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  timezone?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
