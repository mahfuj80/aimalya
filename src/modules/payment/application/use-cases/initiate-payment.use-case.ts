import { Injectable, Logger } from '@nestjs/common';
import { PaymentService } from '../../../../integrations/payment/payment.service';

export type InitiatePaymentInput = {
  userId: string;
  amount: number;
  description: string;
  planType?: string;
};

export type InitiatePaymentOutput = {
  success: boolean;
  clientSecret?: string;
  intentId?: string;
  error?: string;
};

@Injectable()
export class InitiatePaymentUseCase {
  private readonly logger = new Logger(InitiatePaymentUseCase.name);

  constructor(private readonly paymentService: PaymentService) {}

  async execute(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    this.logger.debug(
      `Initiating payment for user ${input.userId}: $${input.amount / 100}`,
    );

    try {
      const paymentResult = await this.paymentService.createPaymentIntent({
        amount: input.amount,
        currency: 'usd',
        customerId: input.userId,
        description: input.description,
        metadata: {
          userId: input.userId,
          planType: input.planType || 'standard',
        },
      });

      if (!paymentResult.success) {
        this.logger.error(
          `Payment intent creation failed: ${paymentResult.error}`,
        );
        return {
          success: false,
          error: paymentResult.error || 'Payment creation failed',
        };
      }

      this.logger.log(
        `Payment intent created: ${paymentResult.intentId} for user ${input.userId}`,
      );

      return {
        success: true,
        clientSecret: paymentResult.clientSecret,
        intentId: paymentResult.intentId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to initiate payment for user ${input.userId}:`,
        error,
      );
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Payment initiation failed',
      };
    }
  }
}
