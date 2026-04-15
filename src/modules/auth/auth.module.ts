import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { AUTH_USER_REPOSITORY } from './domain/repositories/auth-user.repository';
import { PrismaAuthUserRepository } from './infrastructure/repositories/prisma-auth-user.repository';
import { JwtStrategy } from './infrastructure/services/jwt.strategy';
import { PasswordHasherService } from './infrastructure/services/password-hasher.service';
import { TokenService } from './infrastructure/services/token.service';
import { SendOtpSmsUseCase } from './application/use-cases/send-otp-sms.use-case';
import { SendPasswordResetEmailUseCase } from './application/use-cases/send-password-reset-email.use-case';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    SendOtpSmsUseCase,
    SendPasswordResetEmailUseCase,
    PasswordHasherService,
    TokenService,
    JwtStrategy,
    {
      provide: AUTH_USER_REPOSITORY,
      useClass: PrismaAuthUserRepository,
    },
  ],
})
export class AuthModule {}
