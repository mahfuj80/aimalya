import { Injectable } from '@nestjs/common';
import { SmsService } from '../../../../integrations/sms/sms.service';
import {
  IAuthSmsSender,
  SendSmsCommand,
} from '../../application/interfaces/sms-sender.port';

@Injectable()
export class AuthSmsSenderAdapter implements IAuthSmsSender {
  constructor(private readonly smsService: SmsService) {}

  async send(command: SendSmsCommand): Promise<void> {
    const result = await this.smsService.send(command);

    if (!result.success) {
      throw new Error('SMS send failed');
    }
  }
}
