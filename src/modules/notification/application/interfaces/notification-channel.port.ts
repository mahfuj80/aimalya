export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

export type NotificationPayload = {
  userId: string;
  title: string;
  message: string;
  email?: string;
  phoneNumber?: string;
};

export const NOTIFICATION_CHANNEL = Symbol('NOTIFICATION_CHANNEL');

export interface INotificationChannel {
  send(channel: NotificationChannel, payload: NotificationPayload): Promise<void>;
}
