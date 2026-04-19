import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../../../integrations/payment/payment.service';
import {
  IPaymentGateway,
  CreatePaymentIntentCommand,
  CreatePaymentIntentResult,
} from '../../application/interfaces/payment-gateway.port';

@Injectable()
export class StripePaymentGatewayAdapter implements IPaymentGateway {
  constructor(private readonly paymentService: PaymentService) {}

  async createPaymentIntent(
    command: CreatePaymentIntentCommand,
  ): Promise<CreatePaymentIntentResult> {
    return await this.paymentService.createPaymentIntent(command);
  }

  verifyWebhookSignature(
    payload: Buffer | string,
    signature: string,
  ): { verified: boolean; error?: string } {
    return this.paymentService.verifyWebhookSignature(payload, signature);
  }
}
