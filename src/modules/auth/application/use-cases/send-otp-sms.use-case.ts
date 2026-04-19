import { Inject, Injectable, Logger } from '@nestjs/common';
import { AUTH_SMS_SENDER } from '../interfaces/sms-sender.port';
import type { IAuthSmsSender } from '../interfaces/sms-sender.port';

export type SendOtpSmsInput = {
  phoneNumber: string;
  otpCode: string;
  expiryMinutes: number;
};

@Injectable()
export class SendOtpSmsUseCase {
  private readonly logger = new Logger(SendOtpSmsUseCase.name);

  constructor(
    @Inject(AUTH_SMS_SENDER)
    private readonly smsSender: IAuthSmsSender,
  ) {}

  async execute(input: SendOtpSmsInput): Promise<{ success: boolean }> {
    this.logger.debug(`Sending OTP SMS to ${input.phoneNumber}`);

    const message = `Your Aimalya verification code is: ${input.otpCode}. Valid for ${input.expiryMinutes} minutes. Do not share this code.`;

    try {
      await this.smsSender.send({
        phoneNumber: input.phoneNumber,
        message,
      });

      this.logger.log(`OTP SMS sent to ${input.phoneNumber}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to send OTP SMS to ${input.phoneNumber}:`,
        error,
      );
      throw error;
    }
  }
}
