import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  describe('send', () => {
    it('should send email successfully', async () => {
      const payload = {
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test',
        html: '<p>This is a test</p>',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should send email with minimal payload', async () => {
      const payload = {
        to: 'user@example.com',
        subject: 'Subject',
        text: 'Body',
      };

      const result = await service.send(payload);

      expect(result.success).toBe(true);
    });

    it('should handle email send errors gracefully', async () => {
      // TODO: Mock nodemailer to throw error
      // Jest mock: jest.spyOn(transporter, 'sendMail').mockRejectedValue(...)
    });
  });

  describe('sendTemplate', () => {
    it('should send templated email', async () => {
      const result = await service.sendTemplate('user@example.com', 'welcome', {
        name: 'John',
        link: 'https://example.com',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should pass template data to template renderer', async () => {
      await service.sendTemplate('user@example.com', 'password-reset', {
        resetLink: 'https://example.com/reset',
      });

      // TODO: Verify template was rendered with data
    });
  });
});
