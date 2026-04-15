import { Global, Module } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { SmsService } from './sms/sms.service';
import { PaymentService } from './payment/payment.service';

/**
 * IntegrationsModule
 *
 * Global module that exports all external integration services:
 * - Mail (SMTP)
 * - SMS (Twilio)
 * - Payment (Stripe)
 * - Storage (placeholder for S3/GCS)
 *
 * Marked as @Global() so all modules can inject these services
 * without explicit imports.
 *
 * Pattern: These services are infrastructure adapters that handle
 * communication with external APIs. They should be injected into
 * use-cases or other services that need to trigger external actions.
 */
@Global()
@Module({
  providers: [MailService, SmsService, PaymentService],
  exports: [MailService, SmsService, PaymentService],
})
export class IntegrationsModule {}
