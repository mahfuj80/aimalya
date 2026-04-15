import { Injectable } from '@nestjs/common';
import { NotificationChannelService } from '../../infrastructure/services/notification-channel.service';

type SendNotificationInput = {
  userId: string;
  title: string;
  message: string;
  channel: 'IN_APP' | 'EMAIL' | 'SMS';
  email?: string;
  phoneNumber?: string;
};

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationChannelService: NotificationChannelService,
  ) {}

  async execute(input: SendNotificationInput): Promise<{ success: boolean }> {
    await this.notificationChannelService.send(input.channel, {
      userId: input.userId,
      title: input.title,
      message: input.message,
      email: input.email,
      phoneNumber: input.phoneNumber,
    });

    return { success: true };
  }
}
