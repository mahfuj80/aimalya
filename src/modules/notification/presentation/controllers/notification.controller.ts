import { Body, Controller, Post } from '@nestjs/common';
import { SendNotificationRequestDto } from '../../application/dto/send-notification.request.dto';
import { SendNotificationUseCase } from '../../application/use-cases/send-notification.use-case';

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
