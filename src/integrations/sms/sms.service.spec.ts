import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsService],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  describe('send', () => {
    it('should send SMS successfully', async () => {
      const payload = {
        phoneNumber: '+1234567890',
        message: 'Your OTP is 123456',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
      expect(result.sid).toBeDefined();
    });

    it('should validate phone number format', async () => {
      const payload = {
        phoneNumber: '+1234567890',
        message: 'Test message',
      };

      // SMS should accept valid phone numbers
      const result = await service.send(payload);
      expect(result.success).toBe(true);
    });

    it('should handle SMS send errors', async () => {
      // TODO: Mock Twilio to throw error
    });
  });

  describe('sendTemplate', () => {
    it('should send templated SMS', async () => {
      const result = await service.sendTemplate('+1234567890', 'otp', {
        code: '123456',
      });

      expect(result.success).toBe(true);
    });

    it('should substitute template variables', async () => {
      await service.sendTemplate('+1234567890', 'otp', { code: '654321' });

      // TODO: Verify message contains substituted code
    });
  });
});
