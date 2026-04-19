import { Module } from '@nestjs/common';
import { PAYMENT_GATEWAY } from './application/interfaces/payment-gateway.port';
import { InitiatePaymentUseCase } from './application/use-cases/initiate-payment.use-case';
import { VerifyStripeWebhookUseCase } from './application/use-cases/verify-stripe-webhook.use-case';
import { StripePaymentGatewayAdapter } from './infrastructure/services/stripe-payment-gateway.adapter';
import { PaymentController } from './presentation/controllers/payment.controller';
import { PaymentWebhookController } from './presentation/controllers/payment-webhook.controller';

@Module({
  controllers: [PaymentController, PaymentWebhookController],
  providers: [
    InitiatePaymentUseCase,
    VerifyStripeWebhookUseCase,
    StripePaymentGatewayAdapter,
    {
      provide: PAYMENT_GATEWAY,
      useExisting: StripePaymentGatewayAdapter,
    },
  ],
})
export class PaymentModule {}
