export type CreatePaymentIntentCommand = {
  amount: number;
  currency: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
};

export type CreatePaymentIntentResult = {
  success: boolean;
  clientSecret?: string;
  intentId?: string;
  error?: string;
};

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface IPaymentGateway {
  createPaymentIntent(
    command: CreatePaymentIntentCommand,
  ): Promise<CreatePaymentIntentResult>;
  verifyWebhookSignature(
    payload: Buffer | string,
    signature: string,
  ): { verified: boolean; error?: string };
}
