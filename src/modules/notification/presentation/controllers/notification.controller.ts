import { Body, Controller, Post } from '@nestjs/common';
import { SendNotificationUseCase } from '../../application/use-cases/send-notification.use-case';

class SendNotificationRequestDto {
  userId!: string;
  title!: string;
  message!: string;
  channel!: 'IN_APP' | 'EMAIL' | 'SMS';
}

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  @Post('send')
  async send(
    @Body() body: SendNotificationRequestDto,
  ): Promise<{ success: boolean }> {
    return this.sendNotificationUseCase.execute(body);
  }
}
