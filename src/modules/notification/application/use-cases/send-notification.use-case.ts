import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_CHANNEL } from '../interfaces/notification-channel.port';
import type { INotificationChannel } from '../interfaces/notification-channel.port';

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
    @Inject(NOTIFICATION_CHANNEL)
    private readonly notificationChannel: INotificationChannel,
  ) {}

  async execute(input: SendNotificationInput): Promise<{ success: boolean }> {
    await this.notificationChannel.send(input.channel, {
      userId: input.userId,
      title: input.title,
      message: input.message,
      email: input.email,
      phoneNumber: input.phoneNumber,
    });

    return { success: true };
  }
}
