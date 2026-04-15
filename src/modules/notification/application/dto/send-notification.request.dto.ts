import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SendNotificationRequestDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsIn(['IN_APP', 'EMAIL', 'SMS'])
  channel!: 'IN_APP' | 'EMAIL' | 'SMS';

  @ValidateIf((o: SendNotificationRequestDto) => o.channel === 'EMAIL')
  @IsEmail()
  email?: string;

  @ValidateIf((o: SendNotificationRequestDto) => o.channel === 'SMS')
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  metadata?: string;
}
