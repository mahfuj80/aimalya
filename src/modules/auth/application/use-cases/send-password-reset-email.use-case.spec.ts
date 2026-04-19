import { IAuthMailSender } from '../interfaces/mail-sender.port';
import { SendPasswordResetEmailUseCase } from './send-password-reset-email.use-case';

describe('SendPasswordResetEmailUseCase', () => {
  it('sends password reset email through mail sender port', async () => {
    const sendMock = jest.fn().mockResolvedValue(undefined);
    const mailSender: IAuthMailSender = {
      send: sendMock,
    };

    const useCase = new SendPasswordResetEmailUseCase(mailSender);
    const result = await useCase.execute({
      email: 'user@mail.com',
      otpCode: '123456',
      expiryMinutes: 10,
    });

    expect(result.success).toBe(true);
    expect(sendMock.mock.calls).toHaveLength(1);
  });

  it('bubbles mail sender errors', async () => {
    const mailSender: IAuthMailSender = {
      send: jest.fn().mockRejectedValue(new Error('mail unavailable')),
    };

    const useCase = new SendPasswordResetEmailUseCase(mailSender);

    await expect(
      useCase.execute({
        email: 'user@mail.com',
        otpCode: '123456',
        expiryMinutes: 10,
      }),
    ).rejects.toThrow('mail unavailable');
  });
});
