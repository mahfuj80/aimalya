import { Module } from '@nestjs/common';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { NotificationChannelService } from './infrastructure/services/notification-channel.service';
import { NotificationController } from './presentation/controllers/notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [SendNotificationUseCase, NotificationChannelService],
})
export class NotificationModule {}
