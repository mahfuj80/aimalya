import { Module } from '@nestjs/common';
import { ResendVerificationCodeUseCase } from './application/use-cases/resend-verification-code.use-case';
import { SendVerificationCodeUseCase } from './application/use-cases/send-verification-code.use-case';
import { VerifyVerificationCodeUseCase } from './application/use-cases/verify-verification-code.use-case';
import { VERIFICATION_CODE_REPOSITORY } from './domain/repositories/verification-code.repository';
import { PrismaVerificationCodeRepository } from './infrastructure/repositories/prisma-verification-code.repository';
import { VerificationController } from './presentation/controllers/verification.controller';

@Module({
  controllers: [VerificationController],
  providers: [
    SendVerificationCodeUseCase,
    VerifyVerificationCodeUseCase,
    ResendVerificationCodeUseCase,
    {
      provide: VERIFICATION_CODE_REPOSITORY,
      useClass: PrismaVerificationCodeRepository,
    },
  ],
  exports: [SendVerificationCodeUseCase, VerifyVerificationCodeUseCase],
})
export class VerificationModule {}
