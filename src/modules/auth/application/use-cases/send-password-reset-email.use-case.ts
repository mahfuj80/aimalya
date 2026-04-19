import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AUTH_MAIL_SENDER,
} from '../interfaces/mail-sender.port';
import type { IAuthMailSender } from '../interfaces/mail-sender.port';

export type SendPasswordResetEmailInput = {
  email: string;
  otpCode: string;
  expiryMinutes: number;
};

@Injectable()
export class SendPasswordResetEmailUseCase {
  private readonly logger = new Logger(SendPasswordResetEmailUseCase.name);

  constructor(
    @Inject(AUTH_MAIL_SENDER)
    private readonly mailSender: IAuthMailSender,
  ) {}

  async execute(
    input: SendPasswordResetEmailInput,
  ): Promise<{ success: boolean }> {
    this.logger.debug(`Sending password reset email to ${input.email}`);

    // Compose HTML template
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Aimalya account.</p>
      <p>Your verification code is:</p>
      <h2 style="letter-spacing: 0.4rem;">${input.otpCode}</h2>
      <p>This code expires in ${input.expiryMinutes} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    const text = `
      Password reset requested.
      Your verification code is: ${input.otpCode}
      This code expires in ${input.expiryMinutes} minutes.
    `;

    try {
      await this.mailSender.send({
        to: input.email,
        subject: 'Password Reset Request - Aimalya',
        text,
        html,
      });

      this.logger.log(`Password reset email sent to ${input.email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${input.email}:`,
        error,
      );
      throw error;
    }
  }
}
