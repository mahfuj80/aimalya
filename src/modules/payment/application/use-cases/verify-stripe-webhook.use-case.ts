import { Inject, Injectable } from '@nestjs/common';
import {
  PAYMENT_GATEWAY,
} from '../interfaces/payment-gateway.port';
import type { IPaymentGateway } from '../interfaces/payment-gateway.port';

@Injectable()
export class VerifyStripeWebhookUseCase {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  execute(
    payload: Buffer | string,
    signature: string,
  ): { verified: boolean; error?: string } {
    return this.paymentGateway.verifyWebhookSignature(payload, signature);
  }
}
