export type SmsConfig = {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
};

export const getSmsConfig = (): SmsConfig => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
  authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER ?? '',
});
