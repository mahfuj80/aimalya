import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../../../../integrations/mail/mail.service';

export type SendPasswordResetEmailInput = {
  email: string;
  resetToken: string;
  resetUrl: string;
};

/**
 * Example Use-Case: SendPasswordResetEmailUseCase
 *
 * Demonstrates how to integrate MailService into application use-cases.
 *
 * This use-case would be injected into auth controllers/services
 * to send password reset emails when users request email verification.
 *
 * Pattern:
 * 1. Receive email address and token from controller
 * 2. Compose email payload
 * 3. Delegate to MailService infra adapter
 * 4. Return success/error
 */
@Injectable()
export class SendPasswordResetEmailUseCase {
  private readonly logger = new Logger(SendPasswordResetEmailUseCase.name);

  constructor(private readonly mailService: MailService) {}

  async execute(
    input: SendPasswordResetEmailInput,
  ): Promise<{ success: boolean }> {
    this.logger.debug(`Sending password reset email to ${input.email}`);

    // Compose HTML template
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Aimalya account.</p>
      <p>
        <a href="${input.resetUrl}?token=${input.resetToken}">
          Click here to reset your password
        </a>
      </p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    const text = `
      Password reset requested.
      Visit: ${input.resetUrl}?token=${input.resetToken}
      Link expires in 1 hour.
    `;

    try {
      await this.mailService.send({
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
