import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InitiatePaymentRequestDto } from '../../application/dto/initiate-payment.request.dto';
import { InitiatePaymentUseCase } from '../../application/use-cases/initiate-payment.use-case';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly initiatePaymentUseCase: InitiatePaymentUseCase,
  ) {}

  @Post('intent')
  @ApiOperation({ summary: 'Create a Stripe payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  async createPaymentIntent(
    @Body() dto: InitiatePaymentRequestDto,
  ): Promise<{ success: boolean; clientSecret?: string; intentId?: string }> {
    const result = await this.initiatePaymentUseCase.execute(dto);

    return {
      success: result.success,
      clientSecret: result.clientSecret,
      intentId: result.intentId,
    };
  }
}
