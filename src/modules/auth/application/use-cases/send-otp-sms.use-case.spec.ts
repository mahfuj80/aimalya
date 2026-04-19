import { IAuthSmsSender } from '../interfaces/sms-sender.port';
import { SendOtpSmsUseCase } from './send-otp-sms.use-case';

describe('SendOtpSmsUseCase', () => {
  it('sends OTP via sms sender port', async () => {
    const sendMock = jest.fn().mockResolvedValue(undefined);
    const smsSender: IAuthSmsSender = {
      send: sendMock,
    };

    const useCase = new SendOtpSmsUseCase(smsSender);
    const result = await useCase.execute({
      phoneNumber: '+15550001111',
      otpCode: '123456',
      expiryMinutes: 10,
    });

    expect(result.success).toBe(true);
    expect(sendMock.mock.calls).toHaveLength(1);
  });

  it('bubbles sms sender errors', async () => {
    const smsSender: IAuthSmsSender = {
      send: jest.fn().mockRejectedValue(new Error('sms unavailable')),
    };

    const useCase = new SendOtpSmsUseCase(smsSender);

    await expect(
      useCase.execute({
        phoneNumber: '+15550001111',
        otpCode: '123456',
        expiryMinutes: 10,
      }),
    ).rejects.toThrow('sms unavailable');
  });
});
