import { IPaymentGateway } from '../interfaces/payment-gateway.port';
import { VerifyStripeWebhookUseCase } from './verify-stripe-webhook.use-case';

describe('VerifyStripeWebhookUseCase', () => {
  it('returns verified when signature is valid', () => {
    const gateway: IPaymentGateway = {
      createPaymentIntent: jest.fn(),
      verifyWebhookSignature: jest.fn().mockReturnValue({ verified: true }),
    };

    const useCase = new VerifyStripeWebhookUseCase(gateway);
    const result = useCase.execute('payload', 'signature');

    expect(result.verified).toBe(true);
  });

  it('returns verification error when invalid', () => {
    const gateway: IPaymentGateway = {
      createPaymentIntent: jest.fn(),
      verifyWebhookSignature: jest
        .fn()
        .mockReturnValue({ verified: false, error: 'invalid signature' }),
    };

    const useCase = new VerifyStripeWebhookUseCase(gateway);
    const result = useCase.execute('payload', 'signature');

    expect(result.verified).toBe(false);
    expect(result.error).toBe('invalid signature');
  });
});
