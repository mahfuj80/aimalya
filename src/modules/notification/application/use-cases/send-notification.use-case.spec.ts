import { INotificationChannel } from '../interfaces/notification-channel.port';
import { SendNotificationUseCase } from './send-notification.use-case';

describe('SendNotificationUseCase', () => {
  it('dispatches notification through channel port', async () => {
    const channel: INotificationChannel = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new SendNotificationUseCase(channel);
    const result = await useCase.execute({
      userId: 'u1',
      title: 'Notice',
      message: 'Hello',
      channel: 'IN_APP',
    });

    expect(result.success).toBe(true);
    expect(channel.send).toHaveBeenCalled();
  });

  it('bubbles channel errors', async () => {
    const channel: INotificationChannel = {
      send: jest.fn().mockRejectedValue(new Error('channel failure')),
    };

    const useCase = new SendNotificationUseCase(channel);

    await expect(
      useCase.execute({
        userId: 'u1',
        title: 'Notice',
        message: 'Hello',
        channel: 'IN_APP',
      }),
    ).rejects.toThrow('channel failure');
  });
});
