import { IPaymentGateway } from '../interfaces/payment-gateway.port';
import { InitiatePaymentUseCase } from './initiate-payment.use-case';

describe('InitiatePaymentUseCase', () => {
  it('returns client secret when gateway succeeds', async () => {
    const gateway: IPaymentGateway = {
      createPaymentIntent: jest.fn().mockResolvedValue({
        success: true,
        clientSecret: 'cs_test',
        intentId: 'pi_test',
      }),
      verifyWebhookSignature: jest.fn(),
    };

    const useCase = new InitiatePaymentUseCase(gateway);
    const result = await useCase.execute({
      userId: 'u1',
      amount: 1200,
      description: 'Test payment',
    });

    expect(result.success).toBe(true);
    expect(result.intentId).toBe('pi_test');
  });

  it('returns error result when gateway fails', async () => {
    const gateway: IPaymentGateway = {
      createPaymentIntent: jest.fn().mockResolvedValue({
        success: false,
        error: 'gateway failed',
      }),
      verifyWebhookSignature: jest.fn(),
    };

    const useCase = new InitiatePaymentUseCase(gateway);
    const result = await useCase.execute({
      userId: 'u1',
      amount: 1200,
      description: 'Test payment',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('gateway failed');
  });
});
