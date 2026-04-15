import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from '../../../../integrations/payment/payment.service';

@Controller('payments/webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Body() body: Record<string, unknown>,
  ): Promise<{ received: boolean }> {
    const stripeSignatureHeader = request.headers['stripe-signature'];
    const signature = Array.isArray(stripeSignatureHeader)
      ? stripeSignatureHeader[0]
      : stripeSignatureHeader;

    if (!signature) {
      this.logger.warn('Missing stripe-signature header');
      return { received: false };
    }

    const rawBody = request.rawBody ?? Buffer.from(JSON.stringify(body));
    const verification = this.paymentService.verifyWebhookSignature(
      rawBody,
      signature,
    );

    if (!verification.verified) {
      this.logger.warn(
        `Webhook signature verification failed: ${verification.error}`,
      );
      return { received: false };
    }

    const eventType = typeof body.type === 'string' ? body.type : 'unknown';
    this.logger.log(`Stripe webhook received: ${eventType}`);

    return { received: true };
  }
}
