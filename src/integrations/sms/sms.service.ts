import { Injectable, Logger } from '@nestjs/common';
import { getSmsConfig, SmsConfig } from '../../config/sms.config';
import twilio, { Twilio } from 'twilio';

export type SendSmsPayload = {
  phoneNumber: string;
  message: string;
};

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly config: SmsConfig;
  private readonly client: Twilio;

  constructor() {
    this.config = getSmsConfig();
    this.client = twilio(this.config.accountSid, this.config.authToken);
  }

  async send(
    payload: SendSmsPayload,
  ): Promise<{ success: boolean; sid?: string }> {
    try {
      this.logger.debug(`Sending SMS to ${payload.phoneNumber}`);

      if (process.env.NODE_ENV === 'test') {
        return {
          success: true,
          sid: `test-sms-${Date.now()}`,
        };
      }

      const message = await this.client.messages.create({
        body: payload.message,
        from: this.config.phoneNumber,
        to: payload.phoneNumber,
      });

      return {
        success: true,
        sid: message.sid,
      };
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${payload.phoneNumber}:`, error);
      throw error;
    }
  }

  async sendTemplate(
    phoneNumber: string,
    templateName: string,
    templateData: Record<string, string | number | boolean>,
  ): Promise<{ success: boolean; sid?: string }> {
    this.logger.debug(
      `Sending templated SMS: ${templateName} to ${phoneNumber}`,
    );

    const message = `Template: ${templateName}. Data: ${JSON.stringify(templateData)}`;

    return this.send({
      phoneNumber,
      message,
    });
  }
}
