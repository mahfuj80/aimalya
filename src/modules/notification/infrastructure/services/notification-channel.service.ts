import { Injectable } from '@nestjs/common';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

@Injectable()
export class NotificationChannelService {
  async send(
    channel: NotificationChannel,
    payload: { userId: string; title: string; message: string },
  ): Promise<void> {
    // Replace with concrete adapters and external integration calls.
    void channel;
    void payload;
  }
}
