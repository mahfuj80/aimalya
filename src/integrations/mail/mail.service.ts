import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { getMailConfig, MailConfig } from '../../config/mail.config';

export type SendMailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly config: MailConfig;
  private readonly transporter: Transporter;

  constructor() {
    this.config = getMailConfig();
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }

  async send(
    payload: SendMailPayload,
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      this.logger.debug(`Sending email to ${payload.to}`);

      if (process.env.NODE_ENV === 'test') {
        return {
          success: true,
          messageId: `test-mail-${Date.now()}`,
        };
      }

      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(`Failed to send email to ${payload.to}:`, error);
      throw error;
    }
  }

  async sendTemplate(
    to: string,
    templateName: string,
    templateData: Record<string, string | number | boolean>,
  ): Promise<{ success: boolean; messageId?: string }> {
    this.logger.debug(`Sending templated email: ${templateName} to ${to}`);

    const html = `<p>Template: ${templateName}</p><pre>${JSON.stringify(templateData, null, 2)}</pre>`;
    const subject = `${templateName} from Aimalya`;

    return this.send({
      to,
      subject,
      text: `Template: ${templateName}`,
      html,
    });
  }
}
