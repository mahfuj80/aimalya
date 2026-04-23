import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResendVerificationCodeRequestDto } from '../../application/dto/resend-verification-code.request.dto';
import { SendVerificationCodeRequestDto } from '../../application/dto/send-verification-code.request.dto';
import { VerifyVerificationCodeRequestDto } from '../../application/dto/verify-verification-code.request.dto';
import { ResendVerificationCodeUseCase } from '../../application/use-cases/resend-verification-code.use-case';
import { SendVerificationCodeUseCase } from '../../application/use-cases/send-verification-code.use-case';
import { VerifyVerificationCodeUseCase } from '../../application/use-cases/verify-verification-code.use-case';

@ApiTags('Verifications')
@Controller('verifications')
export class VerificationController {
  constructor(
    private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase,
    private readonly verifyVerificationCodeUseCase: VerifyVerificationCodeUseCase,
    private readonly resendVerificationCodeUseCase: ResendVerificationCodeUseCase,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'Create and send a new verification code' })
  @ApiCreatedResponse({
    schema: {
      example: {
        success: true,
        expiresAt: '2026-04-22T12:20:00.000Z',
      },
    },
  })
  async send(
    @Body() dto: SendVerificationCodeRequestDto,
  ): Promise<{ success: boolean; expiresAt: Date }> {
    const result = await this.sendVerificationCodeUseCase.execute(dto);

    return {
      success: true,
      expiresAt: result.expiresAt,
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify and consume a verification code' })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
      },
    },
  })
  verify(
    @Body() dto: VerifyVerificationCodeRequestDto,
  ): Promise<{ success: boolean }> {
    return this.verifyVerificationCodeUseCase.execute(dto);
  }

  @Post('resend')
  @ApiOperation({
    summary: 'Cancel pending code and send a replacement verification code',
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        success: true,
        expiresAt: '2026-04-22T12:20:00.000Z',
      },
    },
  })
  async resend(
    @Body() dto: ResendVerificationCodeRequestDto,
  ): Promise<{ success: boolean; expiresAt: Date }> {
    const result = await this.resendVerificationCodeUseCase.execute(dto);

    return {
      success: true,
      expiresAt: result.expiresAt,
    };
  }
}
