export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS';

export class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly message: string,
    public readonly channel: NotificationChannel,
    public readonly isRead: boolean,
    public readonly createdAt: Date,
  ) {}
}
