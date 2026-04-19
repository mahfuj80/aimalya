import { IAuthMailSender } from '../interfaces/mail-sender.port';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

describe('SendPasswordResetEmailUseCase', () => {
  it('sends password reset email through mail sender port', async () => {
    const mailSender: IAuthMailSender = {
      send: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new SendPasswordResetEmailUseCase(mailSender);
    const result = await useCase.execute({
      email: 'user@mail.com',
      resetToken: 'token-123',
      resetUrl: 'https://example.com/reset',
    });

    expect(result.success).toBe(true);
    expect(mailSender.send).toHaveBeenCalled();
  });

  it('bubbles mail sender errors', async () => {
    const mailSender: IAuthMailSender = {
      send: jest.fn().mockRejectedValue(new Error('mail unavailable')),
    };

    const useCase = new SendPasswordResetEmailUseCase(mailSender);

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        resetToken: 'token-123',
        resetUrl: 'https://example.com/reset',
      }),
    ).rejects.toThrow('mail unavailable');
  });
});
