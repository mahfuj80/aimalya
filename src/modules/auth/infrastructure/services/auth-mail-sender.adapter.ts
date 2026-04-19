import { Injectable } from '@nestjs/common';
import { MailService } from '../../../../integrations/mail/mail.service';
import {
  IAuthMailSender,
  SendMailCommand,
} from '../../application/interfaces/mail-sender.port';

@Injectable()
export class AuthMailSenderAdapter implements IAuthMailSender {
  constructor(private readonly mailService: MailService) {}

  async send(command: SendMailCommand): Promise<void> {
    const result = await this.mailService.send(command);

    if (!result.success) {
      throw new Error('Mail send failed');
    }
  }
}
