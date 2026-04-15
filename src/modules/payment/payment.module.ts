import { Module } from '@nestjs/common';
import { InitiatePaymentUseCase } from './application/use-cases/initiate-payment.use-case';
import { PaymentController } from './presentation/controllers/payment.controller';
import { PaymentWebhookController } from './presentation/controllers/payment-webhook.controller';

@Module({
  controllers: [PaymentController, PaymentWebhookController],
  providers: [InitiatePaymentUseCase],
})
export class PaymentModule {}
