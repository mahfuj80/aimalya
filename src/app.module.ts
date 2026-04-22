import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { IntegrationsModule } from './integrations/integrations.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { AdminAuditModule } from './modules/admin-audit/admin-audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessModule } from './modules/business/business.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [
    ...(process.env.NODE_ENV === 'development'
      ? [
          DevtoolsModule.register({
            http: true,
          }),
        ]
      : []),
    PrismaModule,
    IntegrationsModule,
    AdminAuditModule,
    AuthModule,
    BusinessModule,
    RoleModule,
    UserModule,
    NotificationModule,
    PaymentModule,
    VerificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
