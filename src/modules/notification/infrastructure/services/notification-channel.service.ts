import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { MailService } from '../../../../integrations/mail/mail.service';
import { SmsService } from '../../../../integrations/sms/sms.service';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

export type NotificationPayload = {
  userId: string;
  title: string;
  message: string;
  email?: string;
  phoneNumber?: string;
};

/**
 * NotificationChannelService
 *
 * Routes notifications to appropriate channels:
 * - IN_APP: Would persist to database for in-app display
 * - EMAIL: Sends via MailService (SMTP)
 * - SMS: Sends via SmsService (Twilio)
 *
 * This service orchestrates the integration services.
 * Actual user data (email, phone) comes from parent use-case.
 */
@Injectable()
export class NotificationChannelService {
  private readonly logger = new Logger(NotificationChannelService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly smsService: SmsService,
  ) {}

  async send(
    channel: NotificationChannel,
    payload: NotificationPayload,
  ): Promise<void> {
    switch (channel) {
      case 'IN_APP':
        return this.sendInApp(payload);

      case 'EMAIL':
        return this.sendEmail(payload);

      case 'SMS':
        return this.sendSms(payload);

      default:
        throw new BadRequestException(
          `Unknown notification channel: ${channel}`,
        );
    }
  }

  /**
   * Send in-app notification
   * In production: persist to database, trigger WebSocket/Server-Sent Events
   */
  private async sendInApp(payload: NotificationPayload): Promise<void> {
    this.logger.log(
      `Sending IN_APP notification to user ${payload.userId}: ${payload.title}`,
    );

    // TODO: Persist to database
    // Example:
    // await this.prisma.notification.create({
    //   data: {
    //     userId: payload.userId,
    //     title: payload.title,
    //     message: payload.message,
    //     channel: 'IN_APP',
    //     isRead: false,
    //   },
    // });

    // TODO: Emit event to WebSocket/SSE to notify connected clients
    // Example:
    // this.eventEmitter.emit('notification.created', {
    //   userId: payload.userId,
    //   title: payload.title,
    //   message: payload.message,
    // });

    this.logger.log(`[PLACEHOLDER] In-app notification delivered`);
  }

  /**
   * Send email notification
   * Via MailService which handles SMTP setup and sending
   */
  private async sendEmail(payload: NotificationPayload): Promise<void> {
    if (!payload.email) {
      throw new BadRequestException(
        'Email address is required for EMAIL channel',
      );
    }

    this.logger.log(
      `Sending EMAIL notification to ${payload.email}: ${payload.title}`,
    );

    await this.mailService.send({
      to: payload.email,
      subject: payload.title,
      text: payload.message,
      html: `<p>${payload.message}</p>`,
    });

    this.logger.log(`Email notification sent to ${payload.email}`);
  }

  /**
   * Send SMS notification
   * Via SmsService which handles Twilio setup and sending
   */
  private async sendSms(payload: NotificationPayload): Promise<void> {
    if (!payload.phoneNumber) {
      throw new BadRequestException('Phone number is required for SMS channel');
    }

    this.logger.log(
      `Sending SMS notification to ${payload.phoneNumber}: ${payload.message}`,
    );

    await this.smsService.send({
      phoneNumber: payload.phoneNumber,
      message: payload.message,
    });

    this.logger.log(`SMS notification sent to ${payload.phoneNumber}`);
  }
}
